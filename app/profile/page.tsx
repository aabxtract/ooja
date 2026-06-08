import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MarketCard } from "@/components/MarketCard";
import { PositionTable } from "@/components/PositionTable";
import { formatCurrency } from "@/components/format";
import {
  accountSummary,
  markets,
  positions,
  recentActivity,
} from "@/mockData";

export default function ProfilePage() {
  const watchedMarkets = markets.filter((market) =>
    accountSummary.watchlist.includes(market.id)
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Trading account
            </h1>
            <p className="mt-3 text-base font-semibold text-slate-600">
              Wallet placeholder:{" "}
              <span className="font-mono text-slate-950">
                {accountSummary.wallet}
              </span>
            </p>
          </div>

          <Link
            href="/markets"
            className="rounded-md bg-slate-950 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-emerald-700"
          >
            Find new markets
          </Link>
        </div>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            ["Portfolio value", formatCurrency(accountSummary.portfolioValue)],
            ["Buying power", formatCurrency(accountSummary.buyingPower)],
            ["Total P/L", formatCurrency(accountSummary.totalPnl)],
            ["Open positions", String(accountSummary.openPositions)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <PositionTable positions={positions} />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                  Watchlist
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Markets you are tracking
                </h2>
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {watchedMarkets.map((market) => (
                <MarketCard key={market.id} market={market} compact />
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Recent activity</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {recentActivity.map((item) => (
                <div key={item.id} className="py-4">
                  <p className="font-black text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                    {item.detail}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </AppShell>
  );
}
