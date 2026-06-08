import Link from "next/link";
import type { Market } from "@/mockData";
import { formatCurrency, formatOdds, formatPercent } from "@/components/format";
import { MiniChart } from "@/components/MiniChart";
import { StatusBadge } from "@/components/StatusBadge";

interface MarketCardProps {
  market: Market;
  compact?: boolean;
}

export function MarketCard({ market, compact = false }: MarketCardProps) {
  const upPrice = market.probabilityUp / 100;
  const downPrice = 1 - upPrice;
  const isPositive = market.change24h >= 0;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
              {market.symbol}
            </span>
            <StatusBadge status={market.status} />
            <span className="text-xs font-semibold text-slate-500">
              {market.category}
            </span>
          </div>
          <h3 className="text-base font-black leading-snug text-slate-950">
            {market.title}
          </h3>
          {!compact && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
              {market.question}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-950">
            {market.probabilityUp}%
          </p>
          <p
            className={`text-xs font-bold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {formatPercent(market.change24h)}
          </p>
        </div>
      </div>

      <div className="mt-5 h-20 rounded-md border border-slate-100 bg-slate-50 p-2">
        <MiniChart values={market.chart} tone={isPositive ? "green" : "red"} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Liquidity</p>
          <p className="mt-1 font-black text-slate-950">
            {formatCurrency(market.liquidity, true)}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Volume</p>
          <p className="mt-1 font-black text-slate-950">
            {formatCurrency(market.volume24h, true)}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Expires</p>
          <p className="mt-1 font-black text-slate-950">{market.expiry}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          href={`/bet/${market.id}`}
          className="rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-black text-white transition hover:bg-emerald-700"
        >
          UP {formatOdds(upPrice)}
        </Link>
        <Link
          href={`/bet/${market.id}`}
          className="rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-black text-white transition hover:bg-rose-700"
        >
          DOWN {formatOdds(downPrice)}
        </Link>
      </div>
    </article>
  );
}
