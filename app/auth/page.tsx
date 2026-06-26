"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { connectWallet } from "@/lib/wallet";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (mode === "signup") {
        setMode("login");
        setError("");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
      window.location.href = "/";
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-bold text-[#A1A1AA] hover:text-white transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to ooja
        </Link>

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo-new.png" alt="Ooja Logo" width={160} height={44} className="h-11 w-auto" priority />
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[#27272A] bg-[#18181B] p-8 shadow-2xl">
          <h1 className="mb-2 text-2xl font-black text-white">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-8 text-sm text-[#A1A1AA]">
            {mode === "signup"
              ? "Start predicting on Stacks markets"
              : "Sign in to your account"}
          </p>

          {/* Wallet Connect */}
          <button
            onClick={handleWalletConnect}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#27272A] bg-[#09090B] px-4 py-3.5 text-sm font-bold text-white transition-all hover:border-[#FF8A00] hover:shadow-[0_0_20px_rgba(255,138,0,0.15)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M17 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Continue with Wallet
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272A]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#18181B] px-3 text-[#A1A1AA] font-medium">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#A1A1AA]">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-4 py-3 text-sm font-medium text-white placeholder-[#52525B] outline-none transition-colors focus:border-[#FF8A00]"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#A1A1AA]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-4 py-3 text-sm font-medium text-white placeholder-[#52525B] outline-none transition-colors focus:border-[#FF8A00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#A1A1AA]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-4 py-3 text-sm font-medium text-white placeholder-[#52525B] outline-none transition-colors focus:border-[#FF8A00]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] px-4 py-3.5 text-sm font-black text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,138,0,0.3)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-sm text-[#A1A1AA]">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
              className="font-bold text-[#FF8A00] hover:text-[#FF6B00] transition-colors"
            >
              {mode === "signup" ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
