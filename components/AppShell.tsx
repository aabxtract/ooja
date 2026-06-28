"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/markets", label: "Markets" },
  { href: "/create", label: "Create" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/activity", label: "Activity" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isLoggedIn, walletAddress, logout } = useAuth();

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#312E81] text-lg font-black text-white shadow-sm">
              o
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-black tracking-tight">ooja</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                Prediction Markets
              </span>
            </span>
          </Link>

          <nav className="hidden items-center rounded-full border border-[#E2E8F0] bg-slate-50 p-1 md:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#312E81] text-white shadow-sm"
                      : "text-[#64748B] hover:bg-white hover:text-[#0F172A]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-bold text-[#312E81] shadow-sm transition hover:border-[#7C3AED] hover:text-[#7C3AED]"
              >
                {shortAddress}
              </button>
            ) : (
              <Link
                href="/auth"
                className="rounded-full bg-[#312E81] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#7C3AED]"
              >
                Connect
              </Link>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-[#E2E8F0] bg-white px-4 py-2 md:hidden">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "border-[#312E81] bg-[#312E81] text-white"
                    : "border-[#E2E8F0] text-[#64748B]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {children}

      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            ooja is running in frontend mock mode. Contract settlement, oracle
            pricing, and wallet trading are intentionally not wired here.
          </p>
          <div className="flex gap-4 font-semibold text-slate-600">
            <Link href="/markets" className="hover:text-[#312E81]">
              Markets
            </Link>
            <Link href="/create" className="hover:text-[#312E81]">
              Create
            </Link>
            <Link href="/profile" className="hover:text-[#312E81]">
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
