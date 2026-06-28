import Header from "../components/Header";
import Footer from "../components/Footer";

const activityItems = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  avatar: ["U", "W", "B"][i % 3],
  wallet: `SP${(i * 3 + 2) % 9}F...${(i * 5 + 4) % 9}K${(i * 7 + 6) % 9}L`,
  action: i % 2 === 0 ? "bought" : "sold",
  outcome: i % 2 === 0 ? "Above" : "Below",
  amountStx: ((i * 137) % 900) + 100,
  marketPrice: 2 + (i % 5),
  time: `${i + 1}m ago`,
}));

export default function ActivityPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col selection:bg-[#FF8A00] selection:text-black">
      <Header />
      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-black text-white">Global Activity</h1>
          <div className="flex bg-[#18181B] border border-[#27272A] rounded-full p-1">
            <button className="px-6 py-2 rounded-full bg-[#27272A] text-white font-bold text-sm">All Markets</button>
            <button className="px-6 py-2 rounded-full text-[#A1A1AA] hover:text-white font-bold text-sm transition-colors">My Trades</button>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-2 sm:p-4 shadow-xl">
          {activityItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 text-sm border-b border-[#27272A] p-4 last:border-0 hover:bg-[#27272A]/30 transition-colors rounded-xl">
              <div className="hidden sm:flex h-12 w-12 rounded-full bg-[#09090B] border border-[#27272A] items-center justify-center shrink-0 text-xl font-black text-[#FF8A00]">
                {item.avatar}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-base mb-1">
                  <span className="font-bold text-[#FF8A00]">{item.wallet}</span>
                  <span className="text-[#A1A1AA]"> {item.action} </span>
                  <span className={item.action === "bought" ? "text-[#22C55E]" : "text-[#EF4444]"}>
                    {item.outcome}
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-[#A1A1AA] font-bold text-sm">
                    <span className="text-white">{item.amountStx} STX</span> - Will STX reach ${item.marketPrice}.00?
                  </p>
                  <span className="text-[#71717A] text-xs font-bold bg-[#09090B] px-2 py-1 rounded-md w-max">{item.time}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 text-center">
            <button className="text-[#FF8A00] font-bold hover:text-white transition-colors">Load More Activity</button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
