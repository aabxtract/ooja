"use client";

import { useMemo, useState } from "react";
import type { Market } from "@/mockData";
import { MarketCard } from "@/components/MarketCard";

interface MarketBoardProps {
  markets: Market[];
}

const categories = ["All", "Price", "Crypto", "Protocol", "Ecosystem", "Resolved"];

export function MarketBoard({ markets }: MarketBoardProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Volume");

  const filteredMarkets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return markets
      .filter((market) => {
        const matchesCategory =
          category === "All" || market.category === category;
        const matchesQuery =
          !normalizedQuery ||
          [market.title, market.question, market.symbol, market.category]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "Probability") return b.probabilityUp - a.probabilityUp;
        if (sort === "Liquidity") return b.liquidity - a.liquidity;
        return b.volume24h - a.volume24h;
      });
  }, [category, markets, query, sort]);

  return (
    <section className="space-y-5">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <label className="block">
          <span className="sr-only">Search markets</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search STX, BTC, protocol, TVL..."
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="sr-only">Filter category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none transition focus:border-emerald-500 focus:bg-white md:w-40"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Sort markets</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none transition focus:border-emerald-500 focus:bg-white md:w-40"
          >
            <option>Volume</option>
            <option>Liquidity</option>
            <option>Probability</option>
          </select>
        </label>
      </div>

      {filteredMarkets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-black text-slate-950">No markets found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try a different search term or category.
          </p>
        </div>
      )}
    </section>
  );
}
