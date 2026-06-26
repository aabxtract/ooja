import { authenticateUser } from "@/lib/server/auth";
import { fail, ok, readJson, requireString } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await readJson(request)) as Record<string, unknown>;
    const email = requireString(body.email, "email");
    const password = requireString(body.password, "password");

    const session = await authenticateUser({ email, password });

    return ok({
      message: "Login successful",
      token: session.token,
      walletAddress: session.walletAddress,
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (error) {
    return fail(error);
  }
}
