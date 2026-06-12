import { assertWalletAddress, createWalletNonce } from "@/lib/server/auth";
import { fail, ok, readJson } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const walletAddress = assertWalletAddress(
      (body as Record<string, unknown>).walletAddress
    );
    const nonce = await createWalletNonce(walletAddress);

    return ok({
      walletAddress,
      nonce: nonce.nonce,
      message: nonce.message,
      expiresAt: nonce.expiresAt.toISOString(),
    });
  } catch (error) {
    return fail(error);
  }
}
