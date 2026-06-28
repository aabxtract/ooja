"use client";

/**
 * Modern @stacks/connect helper.
 * We use dynamic imports to ensure these only load in the browser,
 * avoiding Next.js prerender/build failures.
 */

export async function connectWallet() {
  const { connect } = await import("@stacks/connect");
  return connect({
    forceWalletSelect: true,
    persistWalletSelect: true,
    enableLocalStorage: true,
  });
}

export async function disconnectWallet() {
  const { disconnect } = await import("@stacks/connect");
  return disconnect();
}

/**
 * Checks if the user is signed in.
 * Note: Since we want to use this in renders, we must handle SSR.
 */
export function isUserSignedIn(): boolean {
  if (typeof window === "undefined") return false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isConnected } = require("@stacks/connect");
    return isConnected();
  } catch (e) {
    console.error("Error checking connection status", e);
    return false;
  }
}

/**
 * Gets the current user's Stacks address from the connect session.
 * Returns null if not connected.
 */
export function getWalletAddress(): string | null {
  if (typeof window === "undefined") return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getUserData } = require("@stacks/connect");
    const userData = getUserData();
    return userData?.profile?.stxAddress?.mainnet || null;
  } catch {
    return null;
  }
}
