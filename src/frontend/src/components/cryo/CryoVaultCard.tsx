import { cn } from "@/lib/utils";
import type { VaultStatus } from "@/types/backend";
import { AlertTriangle, Lock, Snowflake, Timer, Unlock } from "lucide-react";
/**
 * CryoVaultCard — the signature Froze component.
 *
 * Displays: goal name, current amount, target amount, progress %,
 * countdown timer to unlock, lock duration, and vault status.
 *
 * Visually evolves as savings grow via the cryo-vault-tier-1..4 classes:
 *   tier 1 — early / low progress (thin ice)
 *   tier 2 — building (glacier blue rim)
 *   tier 3 — near complete (cyan glow + outer halo)
 *   tier 4 — complete / locked (internal glow, crystalline depth)
 *
 * Status-based styling:
 *   freezing — solid ice (default)
 *   thawing  — subtle melting animation
 *   thawed   — clear / liquid (no frost)
 *   broken   — fractured ice (shatter tint)
 *
 * Includes a `crystallize` microinteraction triggered on deposit
 * (call `ref.crystallize()` or pass `depositPulse` to flash it).
 */
import { motion, useAnimationControls } from "motion/react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { CryoCard } from "./CryoCard";
import { CryoProgressBar } from "./CryoProgressBar";

export interface CryoVaultCardProps {
  goalName: string;
  currentAmount: bigint;
  targetAmount: bigint;
  /** Nanos since epoch when the vault unlocks. */
  unlockAt: bigint;
  /** Nanos since epoch when the vault was locked. */
  lockedAt: bigint;
  status?: VaultStatus;
  /** Trigger a crystallize pulse (increment to fire). */
  depositPulse?: number;
  /** Optional footer (e.g. deposit / break actions). */
  footer?: ReactNode;
  className?: string;
  marker?: string;
}

function formatAmount(nat: bigint): string {
  // Treat nat as atomic units; render with thousands separators.
  const s = nat.toString();
  return Number(s).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function useCountdown(unlockAt: bigint): {
  remaining: number;
  overdue: boolean;
} {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const unlockMs = Number(unlockAt / 1_000_000n);
  const remaining = Math.max(0, unlockMs - now);
  return { remaining, overdue: remaining <= 0 };
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "Unlocked";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function tierFor(percent: number): 1 | 2 | 3 | 4 {
  if (percent >= 100) return 4;
  if (percent >= 75) return 3;
  if (percent >= 40) return 2;
  return 1;
}

const statusStyles: Record<
  VaultStatus,
  { ring: string; label: string; icon: ReactNode }
> = {
  freezing: {
    ring: "ring-accent/30",
    label: "Freezing",
    icon: <Snowflake className="h-3.5 w-3.5" />,
  },
  thawing: {
    ring: "ring-[oklch(0.82_0.14_85/40%)]",
    label: "Thawing",
    icon: <Timer className="h-3.5 w-3.5" />,
  },
  thawed: {
    ring: "ring-primary/30",
    label: "Thawed",
    icon: <Unlock className="h-3.5 w-3.5" />,
  },
  broken: {
    ring: "ring-destructive/50",
    label: "Broken",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

export function CryoVaultCard({
  goalName,
  currentAmount,
  targetAmount,
  unlockAt,
  lockedAt,
  status = "freezing",
  depositPulse,
  footer,
  className,
  marker,
}: CryoVaultCardProps) {
  const controls = useAnimationControls();
  const lastPulse = useRef<number | undefined>(depositPulse);

  const percent = useMemo(() => {
    if (targetAmount <= 0n) return 0;
    const p = Number((currentAmount * 1000n) / targetAmount) / 10;
    return Math.max(0, Math.min(100, p));
  }, [currentAmount, targetAmount]);

  const tier = tierFor(percent);
  const { remaining, overdue } = useCountdown(unlockAt);
  const lockDurationMs = Math.max(
    0,
    Number(unlockAt / 1_000_000n) - Number(lockedAt / 1_000_000n),
  );
  const statusStyle = statusStyles[status];

  // Crystallize microinteraction on deposit.
  useEffect(() => {
    if (depositPulse === undefined) return;
    if (lastPulse.current === depositPulse) return;
    lastPulse.current = depositPulse;
    controls.start({
      scale: [1, 1.03, 1],
      rotate: [0, 0.6, 0],
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    });
  }, [depositPulse, controls]);

  return (
    <CryoCard
      tier={tier}
      condensation
      facet
      className={cn(
        "relative overflow-hidden p-6 ring-1 ring-inset",
        statusStyle.ring,
        status === "thawing" && "animate-subtle-melting",
        status === "broken" && "animate-ice-shatter",
        className,
      )}
      data-ocid={marker ?? "vault.card"}
    >
      {/* Ambient aurora band behind the card */}
      <div
        aria-hidden
        className="cryo-aurora animate-aurora-glow pointer-events-none absolute -top-12 left-0 right-0 h-24 opacity-40"
      />

      <motion.div animate={controls} className="relative z-10">
        {/* Header: goal + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Vault
            </p>
            <h3 className="mt-1 truncate font-display text-xl font-semibold text-foreground">
              {goalName}
            </h3>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium",
              "bg-muted/40 text-muted-foreground",
            )}
          >
            {statusStyle.icon}
            {statusStyle.label}
          </span>
        </div>

        {/* Amounts */}
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Frozen
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-gradient-frost">
              {formatAmount(currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Target
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-muted-foreground">
              {formatAmount(targetAmount)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <CryoProgressBar percent={percent} height={8} />
        </div>

        {/* Countdown + lock duration */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="cryo-glass rounded-xl p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              {overdue ? (
                <Unlock className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {overdue ? "Unlocked" : "Unlocks in"}
            </p>
            <p className="mt-1 font-mono text-sm tabular-nums text-foreground">
              {formatDuration(remaining)}
            </p>
          </div>
          <div className="cryo-glass rounded-xl p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              <Timer className="h-3 w-3" />
              Lock duration
            </p>
            <p className="mt-1 font-mono text-sm tabular-nums text-foreground">
              {formatDuration(lockDurationMs)}
            </p>
          </div>
        </div>

        {footer ? <div className="mt-5">{footer}</div> : null}
      </motion.div>
    </CryoCard>
  );
}
