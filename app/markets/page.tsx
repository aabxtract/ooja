import { AppShell } from "@/components/AppShell";
import { MarketBoard } from "@/components/MarketBoard";
import { formatCurrency } from "@/components/format";
import { markets } from "@/mockData";

const liveCount = markets.filter((market) => market.status === "Live").length;
const openCount = markets.filter((market) => market.status === "Open").length;
const totalLiquidity = markets.reduce((sum, market) => sum + market.liquidity, 0);

export default function MarketsPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Market board
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Trade active outcome markets
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Search price, protocol, and ecosystem outcomes. Every card uses
              mock data while preserving the flow a real trading desk needs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="px-3">
              <p className="text-xs font-bold text-slate-500">Live</p>
              <p className="mt-1 text-xl font-black text-slate-950">{liveCount}</p>
            </div>
            <div className="border-x border-slate-200 px-3">
              <p className="text-xs font-bold text-slate-500">Open</p>
              <p className="mt-1 text-xl font-black text-slate-950">{openCount}</p>
            </div>
            <div className="px-3">
              <p className="text-xs font-bold text-slate-500">Liquidity</p>
              <p className="mt-1 text-xl font-black text-slate-950">
                {formatCurrency(totalLiquidity, true)}
              </p>
            </div>
          </div>
        </div>

        <MarketBoard markets={markets} />
      </main>
    </AppShell>
  );
}
