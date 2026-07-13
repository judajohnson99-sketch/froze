/**
 * StatsRow — the four CryoStatCards that anchor the dashboard header.
 *
 * Computes its metrics from a normalized vault list:
 *   1. Total Frozen Funds — sum of currentAmount across all vaults
 *   2. Active Vaults — count of vaults with status freezing/thawing
 *   3. Next Unlock — earliest unlockAt rendered as a live countdown
 *   4. Savings Streak — consecutive weeks with ≥1 deposit (placeholder
 *      derived streak when ledger history is unavailable)
 *
 * Mobile-first: cards stack 1-up on mobile, 2-up on sm, 4-up on lg.
 * Each card uses the frosted-glass CryoStatCard with a cyan-glow icon
 * and a staggered motion entrance.
 */
import { CryoStatCard } from "@/components/cryo";
import type { Vault } from "@/types/backend";
import { CalendarClock, Flame, Lock, Snowflake } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export interface StatsRowProps {
  vaults: Vault[];
  /** Optional streak value; if omitted a derived placeholder is shown. */
  streakWeeks?: number;
  marker?: string;
}

function formatCurrency(nat: bigint): string {
  // Treat nat as whole-dollar atomic units; render with thousands separators.
  const n = Number(nat);
  if (!Number.isFinite(n)) return "$0";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function useCountdownDays(unlockAt: bigint | null): {
  label: string;
  overdue: boolean;
} {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (unlockAt === null) return { label: "—", overdue: false };
  const unlockMs = Number(unlockAt / 1_000_000n);
  const remaining = unlockMs - now;
  if (remaining <= 0) return { label: "Unlocked", overdue: true };
  const days = Math.floor(remaining / 86_400_000);
  if (days >= 1)
    return { label: `${days} day${days === 1 ? "" : "s"}`, overdue: false };
  const hours = Math.floor(remaining / 3_600_000);
  return { label: `${hours}h`, overdue: false };
}

export function StatsRow({
  vaults,
  streakWeeks,
  marker = "dashboard.stats",
}: StatsRowProps) {
  const stats = useMemo(() => {
    const totalFrozen = vaults.reduce(
      (sum, v) => sum + (v.currentAmount ?? 0n),
      0n,
    );
    const activeCount = vaults.filter(
      (v) => v.status === "freezing" || v.status === "thawing",
    ).length;
    const nextUnlock =
      vaults
        .filter((v) => v.status === "freezing" || v.status === "thawing")
        .map((v) => v.unlockAt)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))[0] ?? null;
    const streak = streakWeeks ?? 0;
    return { totalFrozen, activeCount, nextUnlock, streak };
  }, [vaults, streakWeeks]);

  const countdown = useCountdownDays(stats.nextUnlock);

  const cards = [
    {
      key: "frozen",
      label: "Total Frozen Funds",
      value: formatCurrency(stats.totalFrozen),
      icon: Snowflake,
      marker: `${marker}.frozen_funds`,
    },
    {
      key: "active",
      label: "Active Vaults",
      value: stats.activeCount,
      icon: Lock,
      marker: `${marker}.active_vaults`,
    },
    {
      key: "unlock",
      label: "Next Unlock",
      value: countdown.label,
      icon: CalendarClock,
      marker: `${marker}.next_unlock`,
    },
    {
      key: "streak",
      label: "Savings Streak",
      value: `${stats.streak} wk${stats.streak === 1 ? "" : "s"}`,
      icon: Flame,
      marker: `${marker}.savings_streak`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <CryoStatCard
            label={card.label}
            value={card.value}
            icon={card.icon}
            marker={card.marker}
            className="h-full"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default StatsRow;
