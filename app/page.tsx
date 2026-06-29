import Header from "./components/Header";

import { Toaster } from "react-hot-toast";
import { OrderProvider } from "./context/OrderContext";
import MarketFeed from "./components/MarketFeed";
import OrderSlip from "./components/OrderSlip";
import LiveActivity from "./components/LiveActivity";

export default function Home() {
  return (
    <OrderProvider>
      <main className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col selection:bg-[#FF8A00] selection:text-black">
        <Header />
        <Toaster position="bottom-right" />

      {/* Main Content Layout */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        
        {/* Left Side: Feed / Markets */}
        <div className="flex flex-col gap-10">
          
          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-[#18181B] border border-[#27272A] text-white p-10 sm:p-14 shadow-2xl">
             <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 text-[250px] leading-none pointer-events-none mix-blend-overlay">
               📈
             </div>
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8A00]/10 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="relative z-10 max-w-2xl">
               <span className="inline-block px-4 py-1.5 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-black tracking-widest rounded-full mb-6 uppercase border border-[#FF8A00]/20">
                 The Premier STX Prediction Market
               </span>
               <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                 Predict the future of Stacks.
               </h1>
               <p className="text-xl text-[#A1A1AA] mb-8 font-medium leading-relaxed">
                 Trade on the most pressing questions in the ecosystem. Back your beliefs with STX, and win when you&apos;re right. Simple, fast, and secure.
               </p>
               <button className="rounded-full bg-white px-8 py-3.5 text-base font-black text-black transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                 Explore Markets <span className="text-[#FF8A00]">→</span>
               </button>
             </div>
          </section>

          <MarketFeed />

          {/* Education / How it works */}
          <section className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A00]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white mb-3">New to Prediction Markets?</h2>
              <p className="text-base text-[#A1A1AA] max-w-xl leading-relaxed font-medium">
                Learn how to read odds, place trades, and manage your portfolio. 
                Prediction markets let you capitalize on your knowledge.
              </p>
            </div>
            <button className="shrink-0 relative z-10 rounded-full border-2 border-[#27272A] bg-[#09090B] text-white px-8 py-3.5 text-sm font-black transition-all hover:border-[#FF8A00] hover:text-[#FF8A00]">
              Read the Guide
            </button>
          </section>

        </div>

        {/* Right Side: Order Slip / Activity */}
        <aside className="hidden lg:flex flex-col gap-6">
          
          <OrderSlip />
          
          <LiveActivity />
        </aside>

      </div>
      
      </main>
    </OrderProvider>
  );
}
