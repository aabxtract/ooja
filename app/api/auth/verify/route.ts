import { assertWalletAddress, verifyWalletNonce } from "@/lib/server/auth";
import { fail, ok, readJson, requireString } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await readJson(request)) as Record<string, unknown>;
    const walletAddress = assertWalletAddress(body.walletAddress);
    const message = requireString(body.message, "message", { max: 2000 });
    const signature = requireString(body.signature, "signature", { max: 140 });
    const publicKey =
      typeof body.publicKey === "string" ? requireString(body.publicKey, "publicKey") : undefined;

    const session = await verifyWalletNonce({
      walletAddress,
      message,
      signature,
      publicKey,
    });

    return ok({
      token: session.token,
      walletAddress: session.walletAddress,
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (error) {
    return fail(error);
  }
}
