"use client";

import { useEffect, useState } from "react";

interface MarketOutcome {
  id: string;
  label: string;
  priceCents: number;
  poolStx: number;
}

interface Market {
  id: string;
  question: string;
  category: string;
  description?: string;
  image?: string;
  status: string;
  outcomes: MarketOutcome[];
  closeAt: string;
  createdAt: string;
}

const CATEGORIES = ["All", "Crypto Prices", "Stacks Ecosystem", "DeFi", "Pop Culture"];

const CATEGORY_MAP: Record<string, string> = {
  "Crypto Prices": "crypto",
  "Stacks Ecosystem": "ecosystem",
  "DeFi": "defi",
  "Pop Culture": "pop culture",
};

function formatPool(outcomes: MarketOutcome[]) {
  const total = outcomes.reduce((sum, o) => sum + o.poolStx, 0);
  if (total >= 1000) return `${(total / 1000).toFixed(1)}k`;
  return String(Math.round(total));
}

function timeLeft(closeAt: string) {
  const diff = new Date(closeAt).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

export default function MarketsGrid() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const params = new URLSearchParams({ status: "open", limit: "50" });
        if (activeCategory !== "All") {
          params.set("category", CATEGORY_MAP[activeCategory] || activeCategory.toLowerCase());
        }
        const res = await fetch(`/api/markets?${params}`);
        if (!res.ok) return;
        const data = await res.json();
        setMarkets(data.markets ?? []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, [activeCategory]);

  return (
    <div>
      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 p-1 bg-[#18181B] rounded-full border border-[#27272A] w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setLoading(true); }}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-colors ${
              activeCategory === cat
                ? "bg-[#27272A] text-white"
                : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Markets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : markets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#A1A1AA] text-lg font-bold">No markets found</p>
          <p className="text-[#71717A] text-sm mt-2">Markets will appear here once created.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {markets.map((market) => {
            const above = market.outcomes.find((o) => o.id === "above");
            const below = market.outcomes.find((o) => o.id === "below");

            return (
              <div
                key={market.id}
                className="flex flex-col bg-[#18181B] border border-[#27272A] rounded-3xl p-6 hover:border-[#FF8A00]/50 transition-all duration-300 cursor-pointer shadow-lg group"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-3xl bg-[#09090B] p-3 rounded-2xl border border-[#27272A] group-hover:border-[#FF8A00]/30 transition-colors">
                    📈
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-[#FF8A00] uppercase tracking-widest">
                      {market.category}
                    </span>
                    <p className="text-[#A1A1AA] text-xs font-bold mt-1">
                      Vol: {formatPool(market.outcomes)} STX
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-6 leading-snug group-hover:text-[#FF8A00] transition-colors line-clamp-2">
                  {market.question}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <button className="rounded-2xl bg-[#09090B] border border-[#27272A] p-4 text-left hover:border-[#22C55E] hover:bg-[#18181B] transition-colors">
                      <span className="block text-xs font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                        {above?.label ?? "Above"}
                      </span>
                      <span className="block text-2xl font-black text-[#22C55E]">
                        {above?.priceCents ?? 50}¢
                      </span>
                    </button>
                    <button className="rounded-2xl bg-[#09090B] border border-[#27272A] p-4 text-left hover:border-[#EF4444] hover:bg-[#18181B] transition-colors">
                      <span className="block text-xs font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                        {below?.label ?? "Below"}
                      </span>
                      <span className="block text-2xl font-black text-[#EF4444]">
                        {below?.priceCents ?? 50}¢
                      </span>
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-[#71717A] ml-4 whitespace-nowrap">
                    {timeLeft(market.closeAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
