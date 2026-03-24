"use client";

import { useState } from "react";
import { createBet } from "@/lib/contract";
import { futureExpiryBlocks } from "@/lib/blocks";
import { fetchStxPriceUsd } from "@/lib/price";

export default function CreateBetClient() {
  const [targetPrice, setTargetPrice] = useState("");
  const [stake, setStake] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("60");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const target = BigInt(Math.round(parseFloat(targetPrice || "0") * 1e8));
      const stakeMicro = BigInt(Math.round(parseFloat(stake || "0") * 1e6));
      const expiryBlocks = BigInt(
        futureExpiryBlocks(Number(expiryMinutes || "0") * 60)
      );

      await createBet({
        targetPrice: target,
        stake: stakeMicro,
        expiryBlock: expiryBlocks,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentPrice = async () => {
    try {
      const price = await fetchStxPriceUsd();
      setTargetPrice(price.toString());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-12">
      <div className="w-full max-w-lg px-4 space-y-6">
        <h1 className="text-3xl font-semibold">Create a STX price bet</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Target price (USD)</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
              />
              <button
                type="button"
                onClick={handleUseCurrentPrice}
                className="px-3 py-2 rounded-md bg-slate-800 text-sm"
              >
                Use live
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Stake (STX)</label>
            <input
              type="number"
              step="0.000001"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Expiry (minutes from now)
            </label>
            <input
              type="number"
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create bet"}
          </button>
        </form>
      </div>
    </main>
  );
}

