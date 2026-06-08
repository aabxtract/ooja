import { AppShell } from "@/components/AppShell";
import CreateBetClient from "./CreateBetClient";

export default function CreateBetPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
            New market
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Create a mock prediction market
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Draft a market the way an organizer or trader would before the
            contract integration exists. This page only updates local UI state.
          </p>
        </div>
        <CreateBetClient />
      </main>
    </AppShell>
  );
}
