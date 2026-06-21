"use client";

import { useOrder } from "../context/OrderContext";

export const predictionMarkets = [
  {
    id: "M-1029",
    category: "Price",
    question: "Will STX close above $2.50 by Friday?",
    closes: "18h 24m",
    pool: "12,430 STX",
    above: 62,
    below: 38,
    image: "📈"
  },
  {
    id: "M-1030",
    category: "Price",
    question: "Will STX reach $3.00 this month?",
    closes: "12d 6h",
    pool: "28,910 STX",
    above: 44,
    below: 56,
    image: "🚀"
  },
  {
    id: "M-1031",
    category: "Ecosystem",
    question: "Will Nakamoto release activate before EOY?",
    closes: "30d 11h",
    pool: "50,200 STX",
    above: 85,
    below: 15,
    image: "⚡"
  },
  {
    id: "M-1032",
    category: "Price",
    question: "Will STX stay below $2.20 in the next 24 hours?",
    closes: "23h 11m",
    pool: "9,805 STX",
    above: 35,
    below: 65,
    image: "📉"
  },
];

export default function MarketFeed() {
  const { selectOutcome, selectedOrder } = useOrder();

  return (
    <section id="markets">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight text-white">Trending Markets</h2>
        <div className="flex gap-2 p-1 bg-[#18181B] rounded-full border border-[#27272A]">
            <button className="px-5 py-1.5 rounded-full bg-[#27272A] text-sm font-bold text-white">All</button>
            <button className="px-5 py-1.5 rounded-full text-sm font-bold text-[#A1A1AA] hover:text-white transition-colors">Price</button>
            <button className="px-5 py-1.5 rounded-full text-sm font-bold text-[#A1A1AA] hover:text-white transition-colors">Ecosystem</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictionMarkets.map((market) => {
          const isAboveSelected = selectedOrder?.marketId === market.id && selectedOrder.outcome === "Above";
          const isBelowSelected = selectedOrder?.marketId === market.id && selectedOrder.outcome === "Below";

          return (
            <div key={market.id} className="flex flex-col bg-[#18181B] border border-[#27272A] rounded-3xl p-6 hover:border-[#FF8A00]/50 transition-all duration-300 shadow-lg">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-[#09090B] p-3 rounded-2xl border border-[#27272A] transition-colors">{market.image}</div>
                  <div>
                    <span className="text-[11px] font-black text-[#FF8A00] uppercase tracking-widest">{market.category}</span>
                    <p className="text-[#A1A1AA] text-xs font-bold mt-1">Vol: {market.pool}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-6 leading-snug">
                {market.question}
              </h3>
              
              <div className="mt-auto grid grid-cols-2 gap-4">
                <button 
                  onClick={() => selectOutcome({ marketId: market.id, question: market.question, outcome: "Above", odds: market.above })}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                    isAboveSelected 
                      ? "bg-[#22C55E]/10 border-[#22C55E] ring-1 ring-[#22C55E]" 
                      : "bg-[#09090B] border-[#27272A] hover:border-[#22C55E] hover:bg-[#18181B]"
                  }`}
                >
                  <span className="block text-xs font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">Above</span>
                  <span className={`block text-2xl font-black ${isAboveSelected ? "text-white" : "text-[#22C55E]"}`}>{market.above}¢</span>
                </button>
                <button 
                  onClick={() => selectOutcome({ marketId: market.id, question: market.question, outcome: "Below", odds: market.below })}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                    isBelowSelected 
                      ? "bg-[#EF4444]/10 border-[#EF4444] ring-1 ring-[#EF4444]" 
                      : "bg-[#09090B] border-[#27272A] hover:border-[#EF4444] hover:bg-[#18181B]"
                  }`}
                >
                  <span className="block text-xs font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">Below</span>
                  <span className={`block text-2xl font-black ${isBelowSelected ? "text-white" : "text-[#EF4444]"}`}>{market.below}¢</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
