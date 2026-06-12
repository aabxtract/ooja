import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ActivityPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col selection:bg-[#FF8A00] selection:text-black">
      <Header isLoggedIn={true} />
      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 lg:p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-black text-white">Global Activity</h1>
          <div className="flex bg-[#18181B] border border-[#27272A] rounded-full p-1">
            <button className="px-6 py-2 rounded-full bg-[#27272A] text-white font-bold text-sm">All Markets</button>
            <button className="px-6 py-2 rounded-full text-[#A1A1AA] hover:text-white font-bold text-sm transition-colors">My Trades</button>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-2 sm:p-4 shadow-xl">
           {[...Array(15)].map((_, i) => (
             <div key={i} className="flex flex-col sm:flex-row gap-4 text-sm border-b border-[#27272A] p-4 last:border-0 hover:bg-[#27272A]/30 transition-colors rounded-xl">
               <div className="hidden sm:flex h-12 w-12 rounded-full bg-[#09090B] border border-[#27272A] items-center justify-center shrink-0 text-xl">
                 {i % 3 === 0 ? '👤' : i % 3 === 1 ? '🐋' : '🤖'}
               </div>
               <div className="flex-1">
                 <p className="text-white font-medium text-base mb-1">
                   <span className="font-bold text-[#FF8A00]">
                     SP{Math.floor(Math.random()*9)}F...{Math.floor(Math.random()*9)}K{Math.floor(Math.random()*9)}L
                   </span> 
                   <span className="text-[#A1A1AA]"> {i%2===0 ? 'bought' : 'sold'} </span>
                   <span className={i%2===0 ? "text-[#22C55E]" : "text-[#EF4444]"}>
                     {i%2===0 ? 'Above' : 'Below'}
                   </span>
                 </p>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                   <p className="text-[#A1A1AA] font-bold text-sm">
                     <span className="text-white">{Math.floor(Math.random()*1000 + 100)} STX</span> • Will STX reach ${2 + (i%5)}.00?
                   </p>
                   <span className="text-[#71717A] text-xs font-bold bg-[#09090B] px-2 py-1 rounded-md w-max">{i + 1}m ago</span>
                 </div>
               </div>
             </div>
           ))}
           
           <div className="p-4 text-center">
             <button className="text-[#FF8A00] font-bold hover:text-white transition-colors">Load More Activity ↓</button>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
