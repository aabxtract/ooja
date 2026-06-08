"use client";

import { useState } from "react";

const categories = ["Price", "Crypto", "Protocol", "Ecosystem"];

export default function CreateBetClient() {
  const [direction, setDirection] = useState("Up");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Market title</span>
          <input
            required
            placeholder="STX closes above $4.00 in July"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-bold text-slate-700">
            Resolution question
          </span>
          <textarea
            required
            rows={4}
            placeholder="Will STX trade above $4.00 before July 31, 2026?"
            className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Category</span>
          <select className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white">
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Symbol</span>
          <input
            required
            placeholder="STX/USD"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Target value</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="4.00"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Expiry date</span>
          <input
            required
            type="date"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <div>
          <span className="text-sm font-bold text-slate-700">Creator side</span>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {["Up", "Down"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDirection(item)}
                className={`rounded-md px-4 py-3 text-sm font-black transition ${
                  direction === item
                    ? item === "Up"
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <label>
          <span className="text-sm font-bold text-slate-700">Initial liquidity</span>
          <input
            required
            type="number"
            min="0"
            step="1"
            placeholder="1000"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-bold text-slate-700">
            Resolution source
          </span>
          <input
            required
            placeholder="Mock oracle, exchange close, public announcement..."
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">
          This creates a frontend-only draft market. No wallet, contract, or
          backend call is made.
        </p>
        <button className="rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700">
          Create mock market
        </button>
      </div>

      {success && (
        <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          Market created successfully in frontend mock mode.
        </p>
      )}
    </form>
  );
}
