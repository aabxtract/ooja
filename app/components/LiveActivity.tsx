"use client";

import { useEffect, useState } from "react";

interface ActivityItem {
  id: string;
  type: string;
  walletAddress?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

function shortAddress(address?: string) {
  if (!address) return "Unknown";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function timeAgo(isoDate: string) {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LiveActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/activity?limit=5");
        if (!res.ok) return;
        const data = await res.json();
        setActivities(data.activity ?? []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 shadow-xl">
      <h3 className="text-sm font-black text-[#A1A1AA] mb-5 uppercase tracking-widest">
        Live Activity
      </h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-xs text-[#71717A]">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-xs text-[#71717A]">No activity yet.</p>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="flex gap-4 text-sm border-b border-[#27272A] pb-4 last:border-0 last:pb-0"
            >
              <div className="h-8 w-8 rounded-full bg-[#09090B] border border-[#27272A] flex items-center justify-center shrink-0 text-base">
                👤
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  <span className="font-bold text-[#FF8A00]">
                    {shortAddress(act.walletAddress)}
                  </span>{" "}
                  {act.message}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[#A1A1AA] font-bold text-xs">
                    {act.metadata?.amountStx != null
                      ? `${act.metadata.amountStx} STX`
                      : act.type.replace(/_/g, " ")}
                  </p>
                  <span className="text-[#71717A] text-xs font-bold">
                    {timeAgo(act.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
