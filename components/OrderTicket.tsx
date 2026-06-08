"use client";

import { useMemo, useState } from "react";
import type { Direction, Market } from "@/mockData";
import { formatCurrency, formatOdds } from "@/components/format";

interface OrderTicketProps {
  market: Market;
}

export function OrderTicket({ market }: OrderTicketProps) {
  const [side, setSide] = useState<Direction>("Up");
  const [stake, setStake] = useState("250");
  const [notice, setNotice] = useState("");

  const upPrice = market.probabilityUp / 100;
  const downPrice = 1 - upPrice;
  const entryPrice = side === "Up" ? upPrice : downPrice;
  const numericStake = Number(stake || "0");
  const maxPayout = useMemo(() => {
    if (!numericStake || entryPrice <= 0) return 0;
    return numericStake / entryPrice;
  }, [entryPrice, numericStake]);
  const potentialProfit = Math.max(0, maxPayout - numericStake);

  const placeMockOrder = () => {
    setNotice(
      `Mock ${side.toUpperCase()} order staged for ${formatCurrency(
        numericStake || 0
      )}. Wallet and contract execution will be added later.`
    );
  };

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Trade ticket
          </p>
          <h2 className="mt-2 text-lg font-black text-slate-950">
            {market.symbol}
          </h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm font-black text-slate-700">
          {market.probabilityUp}%
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
        {(["Up", "Down"] as Direction[]).map((item) => (
          <button
            key={item}
            onClick={() => setSide(item)}
            className={`rounded-md px-3 py-2 text-sm font-black transition ${
              side === item
                ? item === "Up"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            {item} {formatOdds(item === "Up" ? upPrice : downPrice)}
          </button>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-bold text-slate-700">Stake</span>
        <div className="mt-2 flex h-12 items-center rounded-md border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:bg-white">
          <span className="text-sm font-black text-slate-500">$</span>
          <input
            value={stake}
            onChange={(event) => setStake(event.target.value)}
            type="number"
            min="0"
            className="h-full w-full bg-transparent px-2 text-base font-black outline-none"
          />
        </div>
      </label>

      <div className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-500">Entry price</span>
          <span className="font-black text-slate-950">{formatOdds(entryPrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-500">Max payout</span>
          <span className="font-black text-slate-950">
            {formatCurrency(maxPayout)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-500">Potential profit</span>
          <span className="font-black text-emerald-700">
            {formatCurrency(potentialProfit)}
          </span>
        </div>
      </div>

      <button
        onClick={placeMockOrder}
        disabled={market.status === "Settled" || numericStake <= 0}
        className="mt-5 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Review mock order
      </button>

      {notice && (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          {notice}
        </p>
      )}
    </aside>
  );
}
