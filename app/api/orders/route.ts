import { ObjectId } from "mongodb";
import { objectIdFromParam, requireSession } from "@/lib/server/auth";
import { ApiError, created, fail, readJson, requireNumber, requireString } from "@/lib/server/http";
import { recalculateOutcomePrices } from "@/lib/server/markets";
import { ensureBackendIndexes, getCollections } from "@/lib/server/mongodb";
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
    const collections = await getCollections();
    const market = await collections.markets.findOne({ _id: marketId });

    if (!market) {
      throw new ApiError(404, "Market not found.");
    }

    if (market.status !== "open") {
      throw new ApiError(409, "Market is not open for orders.");
    }

    if (market.closeAt.getTime() <= Date.now()) {
      throw new ApiError(409, "Market is closed.");
    }

    const outcome = market.outcomes.find((item) => item.id === outcomeId);

    if (!outcome) {
      throw new ApiError(400, "outcomeId does not exist on this market.");
    }

    const order: OrderDocument = {
      marketId,
      walletAddress: session.walletAddress,
      outcomeId,
      side: "buy",
      amountStx,
      priceCents: outcome.priceCents,
      shares: Number(((amountStx * 100) / outcome.priceCents).toFixed(8)),
      createdAt: new Date(),
    };
    const orderResult = await collections.orders.insertOne(order);
    const updatedOutcomes = applyPoolUpdate(market.outcomes, outcomeId, amountStx);

    await collections.markets.updateOne(
      { _id: marketId },
      {
        $set: {
          outcomes: recalculateOutcomePrices(updatedOutcomes),
          updatedAt: new Date(),
        },
      }
    );

    await collections.activity.insertOne({
      type: "order_created",
      walletAddress: session.walletAddress,
      marketId,
      orderId: orderResult.insertedId,
      message: `${shortWallet(session.walletAddress)} bought ${outcome.label}`,
      metadata: {
        amountStx,
        outcomeId,
        priceCents: order.priceCents,
      },
      createdAt: new Date(),
    });

    return created({ order: serializeOrder({ ...order, _id: orderResult.insertedId }) });
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
