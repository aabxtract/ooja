"use client";

import { connect, disconnect, isConnected } from "@stacks/connect";

// In the modern @stacks/connect API, `connect()` opens the wallet
// and returns addresses; we just need to trigger it from the button.

export async function connectWallet() {
  const result = await connect({
    forceWalletSelect: true,
    persistWalletSelect: true,
    enableLocalStorage: true,
  });
  return result;
}

export function disconnectWallet() {
  return disconnect();
}

export function isUserSignedIn() {
  return isConnected();
}

