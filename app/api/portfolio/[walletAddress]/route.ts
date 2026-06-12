import { ObjectId } from "mongodb";
import { assertWalletAddress, requireWalletOwnerOrAdmin } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";
import { ensureBackendIndexes, getCollections } from "@/lib/server/mongodb";
import { serializeOrder } from "@/lib/server/serializers";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ walletAddress: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensureBackendIndexes();
    const { walletAddress: rawWalletAddress } = await context.params;
    const walletAddress = assertWalletAddress(rawWalletAddress);

    await requireWalletOwnerOrAdmin(request, walletAddress);

    const collections = await getCollections();
    const orders = await collections.orders
      .find({ walletAddress })
      .sort({ createdAt: -1 })
      .toArray();
    const marketIds = [...new Set(orders.map((order) => order.marketId.toString()))].map(
      (id) => new ObjectId(id)
    );
    const markets = marketIds.length
      ? await collections.markets.find({ _id: { $in: marketIds } }).toArray()
      : [];
    const marketsById = new Map(markets.map((market) => [market._id?.toString(), market]));
    const positions = orders.reduce<Record<string, {
      marketId: string;
      question: string;
      outcomeId: string;
      shares: number;
      amountStx: number;
      averagePriceCents: number;
      resolved: boolean;
      winning: boolean | null;
    }>>((acc, order) => {
      const market = marketsById.get(order.marketId.toString());
      const key = `${order.marketId.toString()}:${order.outcomeId}`;
      const existing = acc[key] ?? {
        marketId: order.marketId.toString(),
        question: market?.question ?? "Unknown market",
        outcomeId: order.outcomeId,
        shares: 0,
        amountStx: 0,
        averagePriceCents: 0,
        resolved: market?.status === "resolved",
        winning: market?.status === "resolved" ? market.resolvedOutcomeId === order.outcomeId : null,
      };

      existing.shares = Number((existing.shares + order.shares).toFixed(8));
      existing.amountStx = Number((existing.amountStx + order.amountStx).toFixed(8));
      existing.averagePriceCents =
        existing.shares > 0 ? Math.round((existing.amountStx / existing.shares) * 100) : 0;
      acc[key] = existing;
      return acc;
    }, {});

    return ok({
      walletAddress,
      totals: {
        amountStx: Number(
          orders.reduce((sum, order) => sum + order.amountStx, 0).toFixed(8)
        ),
        shares: Number(orders.reduce((sum, order) => sum + order.shares, 0).toFixed(8)),
        openPositions: Object.values(positions).filter((position) => !position.resolved).length,
      },
      positions: Object.values(positions),
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    return fail(error);
  }
}
