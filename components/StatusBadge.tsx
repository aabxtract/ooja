import type { MarketStatus, PositionStatus } from "@/mockData";

interface StatusBadgeProps {
  status: MarketStatus | PositionStatus | "Up" | "Down";
}

const styles: Record<string, string> = {
  Open: "border-sky-200 bg-sky-50 text-sky-700",
  Live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Settled: "border-slate-200 bg-slate-100 text-slate-700",
  Paused: "border-amber-200 bg-amber-50 text-amber-700",
  Winning: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Losing: "border-rose-200 bg-rose-50 text-rose-700",
  Up: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Down: "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
