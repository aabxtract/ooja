"use client";

import Link from "next/link";
import {
  connectWallet,
  disconnectWallet,
  isUserSignedIn,
} from "@/lib/wallet";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConnected(isUserSignedIn());
    } catch (e) {
      console.error("Failed to check wallet connection", e);
    }
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet();
      setConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      setConnected(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-emerald-500/50"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-[100%] bg-emerald-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-[100%] bg-teal-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
              o
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">ooja</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/create" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors hidden sm:block">
              Create Bet
            </Link>
            <Link href="/profile" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors hidden sm:block">
              My Profile
            </Link>
            
            {!connected ? (
              <button
                onClick={handleConnect}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all bg-emerald-500 shadow-lg shadow-emerald-500/30 rounded-full hover:bg-emerald-400 hover:scale-105 active:scale-95"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-slate-300 transition-all bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-52 lg:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live on Stacks
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
            Predict the Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-200">
              STX Prices
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The first trustless, peer-to-peer prediction market for Stacks. 
            Create, accept, and settle STX price bets entirely on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#050505] font-bold text-lg hover:bg-slate-200 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Betting Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link 
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-medium text-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-slate-400 font-medium">On-chain Settlement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">0%</div>
            <div className="text-sm text-slate-400 font-medium">Platform Fees</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">P2P</div>
            <div className="text-sm text-slate-400 font-medium">No Middlemen</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">STX</div>
            <div className="text-sm text-slate-400 font-medium">Native Asset</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 lg:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How ooja Works</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              A beautifully simple mechanism for trustless price predictions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Create a Bet",
                desc: "Set your target STX price, expiration time, and wager amount. Your funds are locked into the smart contract instantly.",
                icon: <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              },
              {
                title: "2. Someone Accepts",
                desc: "Another user sees your bet and takes the opposing side, locking their counter-wager into the same contract.",
                icon: <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              },
              {
                title: "3. Trustless Settlement",
                desc: "Once the deadline passes, the contract checks the verifiable oracle price and automatically sends the prize to the winner.",
                icon: <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              }
            ].map((step, idx) => (
              <div key={idx} className="relative group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24 lg:pb-32">
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-gradient-to-b from-emerald-900/40 to-[#050505] border border-emerald-500/20 p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to put your STX <br className="hidden md:block" /> where your mouth is?</h2>
          <p className="text-slate-400 text-lg mb-10 relative z-10 max-w-xl mx-auto">
            Connect your wallet to browse open bets or create your own custom prediction market.
          </p>
          <div className="relative z-10 flex justify-center">
             {!connected ? (
              <button
                onClick={handleConnect}
                className="px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
              >
                Connect Wallet to Begin
              </button>
            ) : (
              <Link
                href="/create"
                className="px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
              >
                Create a Bet
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">ooja</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Discord</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
