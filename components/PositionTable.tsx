import Link from "next/link";
import type { Position } from "@/mockData";
import { formatCurrency, formatOdds } from "@/components/format";
import { StatusBadge } from "@/components/StatusBadge";

interface PositionTableProps {
  positions: Position[];
}

export function PositionTable({ positions }: PositionTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-black text-slate-950">Positions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">Stake</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Mark</th>
              <th className="px-4 py-3">P/L</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <Link
                    href={`/bet/${position.marketId}`}
                    className="font-black text-slate-950 hover:text-emerald-700"
                  >
                    {position.marketTitle}
                  </Link>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Expires {position.expiry}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={position.side} />
                </td>
                <td className="px-4 py-4 font-bold text-slate-800">
                  {formatCurrency(position.stake)}
                </td>
                <td className="px-4 py-4 font-bold text-slate-800">
                  {formatOdds(position.entryPrice)}
                </td>
                <td className="px-4 py-4 font-bold text-slate-800">
                  {formatOdds(position.currentPrice)}
                </td>
                <td
                  className={`px-4 py-4 font-black ${
                    position.pnl >= 0 ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {position.pnl >= 0 ? "+" : ""}
                  {formatCurrency(position.pnl)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={position.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
