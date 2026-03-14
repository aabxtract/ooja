"use client";

import { useParams } from "next/navigation";

export default function BetDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full px-4 space-y-4">
        <h1 className="text-3xl font-semibold">Bet #{id}</h1>
        <p className="text-slate-400">
          This page will show bet details, status, and available actions
          (accept, settle, cancel).
        </p>
      </div>
    </main>
  );
}

