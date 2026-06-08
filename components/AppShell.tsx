"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  connectWallet,
  disconnectWallet,
} from "@/lib/wallet";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/markets", label: "Markets" },
  { href: "/create", label: "Create" },
  { href: "/profile", label: "Portfolio" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      setConnected(true);
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setConnected(false);
    } catch (error) {
      console.error("Wallet disconnect failed", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-slate-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80" />
      <div className="pointer-events-none fixed inset-y-0 left-0 z-0 w-px bg-gradient-to-b from-cyan-300 via-emerald-300 to-transparent opacity-60" />

      <header className="sticky top-0 z-50 border-b border-cyan-300/20 bg-slate-950/70 shadow-[0_0_50px_rgba(34,211,238,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/40 bg-cyan-400/15 text-lg font-black text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.28)]">
              o
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-black tracking-tight">ooja</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                Prediction Markets
              </span>
            </span>
          </Link>

          <nav className="hidden items-center rounded-full border border-cyan-300/20 bg-white/5 p-1 md:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                      : "text-slate-300 hover:bg-white/10 hover:text-cyan-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {connected ? (
              <button
                onClick={handleDisconnect}
                className="rounded-full border border-cyan-300/30 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-300/10"
              >
                SP2C...9QK4
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="rounded-full border border-cyan-200/50 bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:bg-emerald-300"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-cyan-300/10 bg-slate-950/60 px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-cyan-300/20 px-3 py-1.5 text-sm font-semibold text-slate-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 border-t border-cyan-300/20 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            ooja is running in frontend mock mode. Contract settlement, oracle
            pricing, and wallet trading are intentionally not wired here.
          </p>
          <div className="flex gap-4 font-semibold text-slate-600">
            <Link href="/markets" className="hover:text-slate-950">
              Markets
            </Link>
            <Link href="/create" className="hover:text-slate-950">
              Create
            </Link>
            <Link href="/profile" className="hover:text-slate-950">
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
