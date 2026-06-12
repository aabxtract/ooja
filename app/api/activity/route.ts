import { fail, ok } from "@/lib/server/http";
import { parseLimit } from "@/lib/server/markets";
import { ensureBackendIndexes, getCollections } from "@/lib/server/mongodb";
import { serializeActivity } from "@/lib/server/serializers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await ensureBackendIndexes();
    const { searchParams } = new URL(request.url);
    const collections = await getCollections();
    const activity = await collections.activity
      .find({})
      .sort({ createdAt: -1 })
      .limit(parseLimit(searchParams, 25, 100))
      .toArray();

    return ok({ activity: activity.map(serializeActivity) });
  } catch (error) {
    return fail(error);
  }
}
