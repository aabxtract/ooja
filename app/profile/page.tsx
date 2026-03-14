"use client";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full px-4 space-y-4">
        <h1 className="text-3xl font-semibold">My Bets</h1>
        <p className="text-slate-400">
          This page will list bets created or accepted by the connected
          address.
        </p>
      </div>
    </main>
  );
}

