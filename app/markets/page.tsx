import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col selection:bg-[#FF8A00] selection:text-black">
      <Header isLoggedIn={true} />
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8">
        <h1 className="text-4xl font-black mb-8 text-white">Explore Markets</h1>
        
        {/* Categories / Filters */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          <button className="px-6 py-2 rounded-full bg-[#FF8A00] text-black font-bold whitespace-nowrap shadow-[0_0_15px_rgba(255,138,0,0.2)]">All</button>
          <button className="px-6 py-2 rounded-full bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white font-bold transition-colors whitespace-nowrap">Crypto Prices</button>
          <button className="px-6 py-2 rounded-full bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white font-bold transition-colors whitespace-nowrap">Stacks Ecosystem</button>
          <button className="px-6 py-2 rounded-full bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white font-bold transition-colors whitespace-nowrap">DeFi</button>
          <button className="px-6 py-2 rounded-full bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white font-bold transition-colors whitespace-nowrap">Pop Culture</button>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            { q: "Will BTC hit $100k before December?", icon: "📈", cat: "Crypto", above: 45, below: 55, vol: "450k" },
            { q: "Will Stacks transaction volume double?", icon: "⚡", cat: "Ecosystem", above: 75, below: 25, vol: "12k" },
            { q: "Will SIP-025 pass by next month?", icon: "📜", cat: "Ecosystem", above: 90, below: 10, vol: "55k" },
            { q: "Will ETH reach $4k this week?", icon: "🚀", cat: "Crypto", above: 30, below: 70, vol: "890k" },
            { q: "Will Miami win the finals?", icon: "🏀", cat: "Sports", above: 60, below: 40, vol: "20k" },
            { q: "Will sBTC launch on mainnet by Q3?", icon: "🏦", cat: "DeFi", above: 85, below: 15, vol: "250k" },
          ].map((m, i) => (
             <div key={i} className="flex flex-col bg-[#18181B] border border-[#27272A] rounded-3xl p-6 hover:border-[#FF8A00]/50 transition-all duration-300 cursor-pointer shadow-lg group">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-3xl bg-[#09090B] p-3 rounded-2xl border border-[#27272A] group-hover:border-[#FF8A00]/30 transition-colors">{m.icon}</div>
                    <div>
                      <span className="text-[11px] font-black text-[#FF8A00] uppercase tracking-widest">{m.cat}</span>
                      <p className="text-[#A1A1AA] text-xs font-bold mt-1">Vol: {m.vol} STX</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-6 leading-snug group-hover:text-[#FF8A00] transition-colors">{m.q}</h3>
                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <button className="rounded-2xl bg-[#09090B] border border-[#27272A] p-4 text-left hover:border-[#22C55E] hover:bg-[#18181B] transition-colors">
                      <span className="block text-xs font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">Above</span>
                      <span className="block text-2xl font-black text-[#22C55E]">{m.above}¢</span>
                    </button>
                    <button className="rounded-2xl bg-[#09090B] border border-[#27272A] p-4 text-left hover:border-[#EF4444] hover:bg-[#18181B] transition-colors">
                      <span className="block text-xs font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">Below</span>
                      <span className="block text-2xl font-black text-[#EF4444]">{m.below}¢</span>
                    </button>
                  </div>
             </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
