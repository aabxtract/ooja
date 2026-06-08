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
  
  // For isConnected, we can try to require it if we are on client.
  // In modern @stacks/connect, it is often exported in a way that
  // we can import it.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isConnected } = require("@stacks/connect");
    return isConnected();
  } catch (e) {
    console.error("Error checking connection status", e);
    return false;
  }
}

