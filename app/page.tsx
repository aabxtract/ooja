"use client";

import Link from "next/link";
import {
  connectWallet,
  disconnectWallet,
  getUserData,
  isUserSignedIn,
} from "@/lib/wallet";
import { NETWORK } from "@/constants";
import { useState } from "react";

export default function Home() {
  const [connected, setConnected] = useState(isUserSignedIn());
  const userData = getUserData();

  const handleConnect = async () => {
    try {
      await connectWallet(NETWORK);
      setConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setConnected(false);
  };

  const address =
    (userData as any)?.profile?.stxAddress?.mainnet ??
    (userData as any)?.profile?.stxAddress?.testnet;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full px-4 space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">ooja — STX Price Bets</h1>
        <p className="text-slate-400">
          Create and accept STX price bets settled on-chain.
        </p>

        <div className="space-x-3">
          {!connected ? (
            <button
              onClick={handleConnect}
              className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Connect Hiro Wallet
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700"
            >
              Disconnect
            </button>
          )}
        </div>

        {connected && address && (
          <p className="text-sm text-slate-400">
            Connected as <span className="font-mono break-all">{address}</span>
          </p>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <Link href="/create" className="text-emerald-400 hover:underline">
            Create a bet
          </Link>
          <Link href="/profile" className="text-emerald-400 hover:underline">
            My bets
          </Link>
        </div>
      </div>
    </main>
  );
}

