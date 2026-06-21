"use client";

import { useOrder } from "../context/OrderContext";
import toast from "react-hot-toast";

export default function OrderSlip() {
  const { selectedOrder, wagerAmount, setWagerAmount, clearSlip } = useOrder();

  const handlePlaceOrder = () => {
    if (!wagerAmount || isNaN(Number(wagerAmount)) || Number(wagerAmount) <= 0) {
      toast.error("Please enter a valid STX amount.");
      return;
    }
    
    toast.success(`Successfully placed ${wagerAmount} STX on ${selectedOrder?.outcome}!`);
    clearSlip();
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 sticky top-[100px] shadow-xl">
      <h3 className="text-xl font-black text-white mb-6 flex items-center justify-between">
        Order Slip
        <span className="text-xs bg-[#27272A] text-white px-2.5 py-1 rounded-full font-bold">
          {selectedOrder ? "1" : "0"}
        </span>
      </h3>
      
      {!selectedOrder ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#27272A] rounded-2xl bg-[#09090B]">
          <div className="text-4xl mb-4 grayscale opacity-20">🎫</div>
          <p className="text-base font-bold text-white">Your slip is empty</p>
          <p className="text-sm text-[#A1A1AA] mt-2 max-w-[220px] font-medium leading-relaxed">
            Click an outcome on any market to start trading.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${selectedOrder.outcome === "Above" ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {selectedOrder.outcome}
              </span>
              <p className="text-sm font-bold text-white mt-1 leading-snug">
                {selectedOrder.question}
              </p>
            </div>
            <button 
              onClick={clearSlip}
              className="text-[#A1A1AA] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#09090B] border border-[#27272A] rounded-2xl p-4">
            <span className="text-sm font-bold text-[#A1A1AA]">Odds</span>
            <span className="text-lg font-black text-white">{selectedOrder.odds}¢</span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">Wager Amount</label>
            <div className="relative">
              <input
                type="number"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FF8A00] text-white text-lg font-bold rounded-2xl py-3 px-4 outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] font-bold">STX</span>
            </div>
          </div>

          {wagerAmount && Number(wagerAmount) > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
              <span className="text-sm font-bold text-[#A1A1AA]">Potential Payout</span>
              <span className="text-lg font-black text-[#22C55E]">
                {((Number(wagerAmount) / (selectedOrder.odds / 100))).toFixed(2)} STX
              </span>
            </div>
          )}

          <button 
            onClick={handlePlaceOrder}
            className="w-full rounded-full bg-white py-3.5 text-base font-black text-black transition-transform hover:scale-[1.02] mt-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
