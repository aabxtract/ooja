import { objectIdFromParam, requireAdmin } from "@/lib/server/auth";
import { ApiError, fail, ok, readJson } from "@/lib/server/http";
import { buildMarketPatch, validateMarketPatch } from "@/lib/server/markets";
import { ensureBackendIndexes, getCollections } from "@/lib/server/mongodb";
import { serializeMarket } from "@/lib/server/serializers";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await ensureBackendIndexes();
    const { id } = await context.params;
    const collections = await getCollections();
    const market = await collections.markets.findOne({ _id: objectIdFromParam(id) });

    if (!market) {
      throw new ApiError(404, "Market not found.");
    }

    return ok({ market: serializeMarket(market) });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    requireAdmin(request);
    await ensureBackendIndexes();

    const { id } = await context.params;
    const marketId = objectIdFromParam(id);
    const body = await readJson(request);
    const patch = buildMarketPatch(body);
    const collections = await getCollections();
    const market = await collections.markets.findOne({ _id: marketId });

    if (!market) {
      throw new ApiError(404, "Market not found.");
    }

    const hasOrders =
      patch.outcomes !== undefined
        ? (await collections.orders.countDocuments({ marketId }, { limit: 1 })) > 0
        : false;

    validateMarketPatch(market, patch, { hasOrders });

    const result = await collections.markets.findOneAndUpdate(
      { _id: marketId, status: { $nin: ["resolved", "cancelled"] } },
      { $set: patch },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new ApiError(404, "Market not found.");
    }

    await collections.activity.insertOne({
      type: "market_updated",
      marketId,
      message: `Market updated: ${result.question}`,
      createdAt: new Date(),
    });

    return ok({ market: serializeMarket(result) });
  } catch (error) {
    return fail(error);
  }
}
