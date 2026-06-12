import { objectIdFromParam, requireAdmin } from "@/lib/server/auth";
import { ApiError, fail, ok, readJson, requireString } from "@/lib/server/http";
import { ensureBackendIndexes, getCollections } from "@/lib/server/mongodb";
import { serializeMarket } from "@/lib/server/serializers";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    requireAdmin(request);
    await ensureBackendIndexes();

    const { id } = await context.params;
    const marketId = objectIdFromParam(id);
    const body = (await readJson(request)) as Record<string, unknown>;
    const outcomeId = requireString(body.outcomeId, "outcomeId", { max: 32 }).toLowerCase();
    const collections = await getCollections();
    const market = await collections.markets.findOne({ _id: marketId });

    if (!market) {
      throw new ApiError(404, "Market not found.");
    }

    if (!market.outcomes.some((outcome) => outcome.id === outcomeId)) {
      throw new ApiError(400, "outcomeId does not exist on this market.");
    }

    if (market.status === "resolved") {
      throw new ApiError(409, "Market is already resolved.");
    }

    const result = await collections.markets.findOneAndUpdate(
      { _id: marketId },
      {
        $set: {
          status: "resolved",
          resolvedOutcomeId: outcomeId,
          resolvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new ApiError(404, "Market not found.");
    }

    await collections.activity.insertOne({
      type: "market_resolved",
      marketId,
      message: `Market resolved: ${result.question}`,
      metadata: { outcomeId },
      createdAt: new Date(),
    });

    return ok({ market: serializeMarket(result) });
  } catch (error) {
    return fail(error);
  }
}
