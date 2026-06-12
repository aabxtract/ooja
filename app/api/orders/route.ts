import { ObjectId } from "mongodb";
import { objectIdFromParam, requireSession } from "@/lib/server/auth";
import { ApiError, created, fail, readJson, requireNumber, requireString } from "@/lib/server/http";
import { recalculateOutcomePrices } from "@/lib/server/markets";
import { ensureBackendIndexes, getCollections, getMongoClient } from "@/lib/server/mongodb";
import { serializeOrder } from "@/lib/server/serializers";
import type { MarketOutcome, OrderDocument } from "@/lib/server/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    await ensureBackendIndexes();

    const body = (await readJson(request)) as Record<string, unknown>;
    const marketId = objectIdFromParam(requireString(body.marketId, "marketId"));
    const outcomeId = requireString(body.outcomeId, "outcomeId", { max: 32 }).toLowerCase();
    const amountStx = requireNumber(body.amountStx, "amountStx", { min: 0.000001 });
    const { order, orderId } = await createOrderTransaction({
      amountStx,
      marketId,
      outcomeId,
      walletAddress: session.walletAddress,
    });

    return created({ order: serializeOrder({ ...order, _id: orderId }) });
  } catch (error) {
    return fail(error);
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireSession(request);
    await ensureBackendIndexes();
    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get("marketId");
    const collections = await getCollections();
    const filter: { walletAddress: string; marketId?: ObjectId } = {
      walletAddress: session.walletAddress,
    };

    if (marketId) {
      filter.marketId = objectIdFromParam(marketId);
    }

    const orders = await collections.orders
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return Response.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    return fail(error);
  }
}

function applyPoolUpdate(
  outcomes: MarketOutcome[],
  outcomeId: string,
  amountStx: number
) {
  return outcomes.map((outcome) =>
    outcome.id === outcomeId
      ? { ...outcome, poolStx: Number((outcome.poolStx + amountStx).toFixed(8)) }
      : outcome
  );
}

function shortWallet(walletAddress: string) {
  return `${walletAddress.slice(0, 5)}...${walletAddress.slice(-4)}`;
}

async function createOrderTransaction(args: {
  amountStx: number;
  marketId: ObjectId;
  outcomeId: string;
  walletAddress: string;
}) {
  const client = await getMongoClient();
  const session = client.startSession();

  try {
    return await runTransactionWithRetry(async () => {
      const result = await session.withTransaction(async () => {
        const collections = await getCollections();
        const now = new Date();
        const market = await collections.markets.findOne(
          { _id: args.marketId },
          { session }
        );

        if (!market) {
          throw new ApiError(404, "Market not found.");
        }

        if (market.status !== "open") {
          throw new ApiError(409, "Market is not open for orders.");
        }

        if (market.closeAt.getTime() <= now.getTime()) {
          throw new ApiError(409, "Market is closed.");
        }

        const outcome = market.outcomes.find((item) => item.id === args.outcomeId);

        if (!outcome) {
          throw new ApiError(400, "outcomeId does not exist on this market.");
        }

        const order: OrderDocument = {
          marketId: args.marketId,
          walletAddress: args.walletAddress,
          outcomeId: args.outcomeId,
          side: "buy",
          amountStx: args.amountStx,
          priceCents: outcome.priceCents,
          shares: Number(((args.amountStx * 100) / outcome.priceCents).toFixed(8)),
          createdAt: now,
        };
        const updatedOutcomes = recalculateOutcomePrices(
          applyPoolUpdate(market.outcomes, args.outcomeId, args.amountStx)
        );
        const marketUpdate = await collections.markets.updateOne(
          {
            _id: args.marketId,
            status: "open",
            closeAt: { $gt: now },
            "outcomes.id": args.outcomeId,
          },
          {
            $set: {
              outcomes: updatedOutcomes,
              updatedAt: now,
            },
          },
          { session }
        );

        if (marketUpdate.modifiedCount !== 1) {
          throw new ApiError(409, "Market changed while placing the order. Please try again.");
        }

        const orderResult = await collections.orders.insertOne(order, { session });

        await collections.activity.insertOne(
          {
            type: "order_created",
            walletAddress: args.walletAddress,
            marketId: args.marketId,
            orderId: orderResult.insertedId,
            message: `${shortWallet(args.walletAddress)} bought ${outcome.label}`,
            metadata: {
              amountStx: args.amountStx,
              outcomeId: args.outcomeId,
              priceCents: order.priceCents,
            },
            createdAt: now,
          },
          { session }
        );

        return { order, orderId: orderResult.insertedId };
      });

      if (!result) {
        throw new ApiError(500, "Order transaction did not complete.");
      }

      return result;
    });
  } finally {
    await session.endSession();
  }
}

async function runTransactionWithRetry<T>(operation: () => Promise<T>) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!hasTransientTransactionLabel(error) || attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw new ApiError(500, "Transaction retry failed.");
}

function hasTransientTransactionLabel(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "hasErrorLabel" in error &&
    typeof error.hasErrorLabel === "function" &&
    error.hasErrorLabel("TransientTransactionError")
  );
}
