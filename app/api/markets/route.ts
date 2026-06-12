import { requireAdmin } from "@/lib/server/auth";
import { created, fail, ok, readJson } from "@/lib/server/http";
import {
  buildMarketFilter,
  parseLimit,
  parseMarketCreateBody,
} from "@/lib/server/markets";
import { ensureBackendIndexes, getCollections } from "@/lib/server/mongodb";
import { serializeMarket } from "@/lib/server/serializers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await ensureBackendIndexes();
    const { searchParams } = new URL(request.url);
    const collections = await getCollections();
    const markets = await collections.markets
      .find(buildMarketFilter(searchParams))
      .sort({ closeAt: 1, createdAt: -1 })
      .limit(parseLimit(searchParams))
      .toArray();

    return ok({ markets: markets.map(serializeMarket) });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin(request);
    await ensureBackendIndexes();

    const body = await readJson(request);
    const market = parseMarketCreateBody(body, "admin");
    const collections = await getCollections();
    const result = await collections.markets.insertOne(market);

    await collections.activity.insertOne({
      type: "market_created",
      marketId: result.insertedId,
      message: `Market created: ${market.question}`,
      createdAt: new Date(),
    });

    return created({ market: serializeMarket({ ...market, _id: result.insertedId }) });
  } catch (error) {
    return fail(error);
  }
}
