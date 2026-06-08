import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MiniChart } from "@/components/MiniChart";
import { OrderTicket } from "@/components/OrderTicket";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatCurrency,
  formatNumber,
  formatOdds,
  formatPercent,
} from "@/components/format";
import { getMarketById, markets } from "@/mockData";

export function generateStaticParams() {
  return markets.map((market) => ({ id: market.id }));
}

export default async function BetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const market = getMarketById(id);

  if (!market) {
    notFound();
  }

  const upPrice = market.probabilityUp / 100;
  const downPrice = 1 - upPrice;
  const isPositive = market.change24h >= 0;

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/markets"
          className="mb-5 inline-flex text-sm font-black text-slate-500 hover:text-slate-950"
        >
          Back to markets
        </Link>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                      {market.symbol}
                    </span>
                    <StatusBadge status={market.status} />
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                      {market.category}
                    </span>
                  </div>
                  <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    {market.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                    {market.description}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:min-w-48">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    UP probability
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {market.probabilityUp}%
                  </p>
                  <p
                    className={`mt-1 text-sm font-black ${
                      isPositive ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {formatPercent(market.change24h)} 24h
                  </p>
                </div>
              </div>

              <div className="mt-6 h-72 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <MiniChart values={market.chart} tone={isPositive ? "green" : "red"} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Current reference", formatCurrency(market.currentPrice)],
                ["Target", formatCurrency(market.targetPrice)],
                ["Liquidity", formatCurrency(market.liquidity, true)],
                ["Open interest", formatCurrency(market.openInterest, true)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">Order book</h2>
                <div className="mt-4 space-y-2">
                  {market.orderBook.map((level) => (
                    <div
                      key={`${level.price}-${level.upSize}`}
                      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm"
                    >
                      <div className="h-8 overflow-hidden rounded bg-emerald-50">
                        <div
                          className="h-full bg-emerald-200"
                          style={{ width: `${Math.min(100, level.upSize / 9)}%` }}
                        />
                      </div>
                      <div className="w-20 text-center font-mono font-black text-slate-800">
                        {formatOdds(level.price)}
                      </div>
                      <div className="h-8 overflow-hidden rounded bg-rose-50">
                        <div
                          className="h-full bg-rose-200"
                          style={{ width: `${Math.min(100, level.downSize / 9)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 text-xs font-bold text-slate-500">
                  <span>UP size</span>
                  <span className="text-center">Price</span>
                  <span className="text-right">DOWN size</span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">Recent trades</h2>
                <div className="mt-4 divide-y divide-slate-100">
                  {market.recentTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-sm"
                    >
                      <StatusBadge status={trade.side} />
                      <div>
                        <p className="font-black text-slate-950">
                          {formatNumber(trade.size)} shares at{" "}
                          {formatOdds(trade.price)}
                        </p>
                        <p className="font-semibold text-slate-500">
                          {trade.trader}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {trade.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <OrderTicket market={market} />
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">
                Contract readiness
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This detail page is frontend-complete. The buttons stage mock
                orders only because the current contract call signatures still
                need to be aligned before real settlement is safe.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-emerald-50 p-3">
                  <p className="text-xs font-bold text-emerald-700">UP price</p>
                  <p className="mt-1 text-xl font-black text-emerald-900">
                    {formatOdds(upPrice)}
                  </p>
                </div>
                <div className="rounded-md bg-rose-50 p-3">
                  <p className="text-xs font-bold text-rose-700">DOWN price</p>
                  <p className="mt-1 text-xl font-black text-rose-900">
                    {formatOdds(downPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
