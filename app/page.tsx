import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MarketCard } from "@/components/MarketCard";
import { MiniChart } from "@/components/MiniChart";
import { OrderTicket } from "@/components/OrderTicket";
import { PositionTable } from "@/components/PositionTable";
import { formatCurrency } from "@/components/format";
import { accountSummary, markets, positions } from "@/mockData";

const featuredMarket = markets[0];
const activeMarkets = markets.filter((market) => market.status !== "Settled");
const totalVolume = markets.reduce((sum, market) => sum + market.volume24h, 0);
const totalLiquidity = markets.reduce((sum, market) => sum + market.liquidity, 0);

export default function Home() {
  return (
    <AppShell>
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-10">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Mock market live
                </span>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                  Stacks prediction trading
                </span>
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Trade event outcomes with a clean market desk.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                ooja is a simple prediction-market frontend for Stacks price and
                ecosystem events. Browse markets, stage mock UP or DOWN orders,
                and review positions before the wallet and contract flow is
                connected.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/markets"
                  className="rounded-md bg-slate-950 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-emerald-700"
                >
                  Open market board
                </Link>
                <Link
                  href="/create"
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Create mock market
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["24h volume", formatCurrency(totalVolume, true)],
                  ["Liquidity", formatCurrency(totalLiquidity, true)],
                  ["Buying power", formatCurrency(accountSummary.buyingPower)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <OrderTicket market={featuredMarket} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Active markets
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Top trading opportunities
              </h2>
            </div>
            <Link
              href="/markets"
              className="text-sm font-black text-emerald-700 hover:text-emerald-900"
            >
              View all markets
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {activeMarkets.slice(0, 3).map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <PositionTable positions={positions.slice(0, 3)} />

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Market pulse
            </p>
            <h2 className="mt-2 text-lg font-black text-slate-950">
              STX sentiment index
            </h2>
            <div className="mt-5 h-44 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <MiniChart
                values={[42, 46, 51, 49, 55, 58, 61, 64, 62, 67, 69, 72]}
                tone="blue"
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-emerald-50 p-3">
                <p className="text-xs font-bold text-emerald-700">UP demand</p>
                <p className="mt-1 text-xl font-black text-emerald-900">68%</p>
              </div>
              <div className="rounded-md bg-rose-50 p-3">
                <p className="text-xs font-bold text-rose-700">DOWN demand</p>
                <p className="mt-1 text-xl font-black text-rose-900">32%</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
