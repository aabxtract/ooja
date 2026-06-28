import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col selection:bg-[#FF8A00] selection:text-black">
      <Header />
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        
        {/* Main Portfolio Content */}
        <div className="flex flex-col gap-10">
          
          <section className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-[100px] pointer-events-none -mt-20 -mr-20"></div>
             <div className="relative z-10">
               <h1 className="text-xl font-bold mb-2 text-[#A1A1AA]">Portfolio Value</h1>
               <div className="text-5xl sm:text-6xl font-black text-white mb-3">$4,205.50</div>
               <div className="text-lg font-bold text-[#22C55E] bg-[#22C55E]/10 px-3 py-1.5 rounded-full inline-block border border-[#22C55E]/20">
                 +$120.00 (2.5%) All Time
               </div>
               
               <div className="mt-10 h-64 bg-[#09090B] border border-[#27272A] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 border-b border-[#22C55E] opacity-50" style={{ clipPath: "polygon(0 80%, 20% 70%, 40% 90%, 60% 50%, 80% 60%, 100% 30%, 100% 100%, 0 100%)", background: "linear-gradient(180deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 100%)" }}></div>
                  <span className="text-[#71717A] font-bold z-10">[ Chart Component ]</span>
               </div>
             </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-black tracking-tight text-white">Open Positions</h2>
               <button className="text-sm font-bold text-[#FF8A00] hover:text-white transition-colors">View History</button>
             </div>
             
             <div className="flex flex-col gap-4">
                {[
                  { q: "Will STX close above $2.50?", shares: 500, side: "Above", avg: 40, cur: 45, pl: "+$25.00", color: "text-[#22C55E]" },
                  { q: "Will Nakamoto release activate before EOY?", shares: 1200, side: "Above", avg: 85, cur: 90, pl: "+$60.00", color: "text-[#22C55E]" },
                  { q: "Will STX reach $3.00 this month?", shares: 250, side: "Below", avg: 60, cur: 55, pl: "-$12.50", color: "text-[#EF4444]" }
                ].map((pos, i) => (
                  <div key={i} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:border-[#FF8A00]/50 transition-colors">
                     <div>
                       <span className="text-xs font-black text-[#A1A1AA] uppercase mb-2 block tracking-wider bg-[#09090B] px-2 py-1 rounded-md w-max">
                         {pos.side} • {pos.shares} Shares
                       </span>
                       <p className="text-lg font-bold text-white">{pos.q}</p>
                       <div className="flex gap-4 mt-2 text-sm text-[#71717A] font-medium">
                         <span>Avg Price: {pos.avg}¢</span>
                         <span>Current: {pos.cur}¢</span>
                       </div>
                     </div>
                     <div className="text-left sm:text-right w-full sm:w-auto bg-[#09090B] sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-[#27272A]">
                       <p className="text-xs text-[#A1A1AA] font-bold mb-1 sm:hidden">P&L</p>
                       <p className={`text-2xl font-black ${pos.color}`}>{pos.pl}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* User Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 shadow-xl sticky top-[100px]">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-[#09090B] border-2 border-[#FF8A00] flex items-center justify-center text-3xl mb-4 shadow-[0_0_15px_rgba(255,138,0,0.3)]">👤</div>
              <h3 className="text-xl font-black text-white">SP3F...8K9L</h3>
              <p className="text-sm text-[#A1A1AA] font-bold mt-1 bg-[#27272A] px-3 py-1 rounded-full">Connected</p>
            </div>
            
            <div className="flex flex-col gap-4 text-sm border-t border-[#27272A] pt-6">
              <div className="flex justify-between items-center bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                <span className="text-[#A1A1AA] font-bold">Cash Balance</span>
                <span className="font-black text-white text-base">1,200.00 STX</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                <span className="text-[#A1A1AA] font-bold">Positions Value</span>
                <span className="font-black text-white text-base">3,005.50 STX</span>
              </div>
            </div>
            
            <button className="w-full mt-6 rounded-xl bg-[#27272A] hover:bg-[#EF4444] text-white hover:text-white py-3.5 font-black transition-colors">
               Disconnect Wallet
            </button>
          </div>
        </aside>
      </div>
      <Footer />
    </main>
  );
}
