import type { VaultView } from "@/backend";
import { CryoModal, CryoProgressBar } from "@/components/cryo";
import { useGetVaultLedger } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { VaultStatus } from "@/types/backend";
import { AlertTriangle, Lock, Snowflake, Timer, Unlock } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { VaultLedgerList } from "./VaultLedgerList";

/**
 * VaultDetailModal — full vault view + ledger history.
 *
 * Wraps CryoModal. On open, fetches the vault's ledger via
 * useGetVaultLedger and renders a frosted-glass ledger list.
 * Shows the vault header (goal, status badge, amounts, progress,
 * countdown, lock duration) above the ledger.
 */
export interface VaultDetailModalProps {
  vault: VaultView;
  trigger: ReactNode;
  marker?: string;
}

const statusBadge: Record<
  VaultStatus,
  { label: string; icon: typeof Snowflake; className: string }
> = {
  freezing: {
    label: "Freezing",
    icon: Snowflake,
    className: "bg-accent/15 text-accent ring-accent/40",
  },
  thawing: {
    label: "Thawing",
    icon: Timer,
    className:
      "bg-[oklch(0.82_0.14_85/15%)] text-[oklch(0.82_0.14_85)] ring-[oklch(0.82_0.14_85/40%)]",
  },
  thawed: {
    label: "Thawed",
    icon: Unlock,
    className: "bg-primary/15 text-primary ring-primary/40",
  },
  broken: {
    label: "Broken",
    icon: AlertTriangle,
    className: "bg-destructive/15 text-destructive ring-destructive/40",
  },
};

function formatAmount(nat: bigint): string {
  return Number(nat.toString()).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
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

function useCountdown(unlockAt: bigint) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const unlockMs = Number(unlockAt / 1_000_000n);
  const remaining = Math.max(0, unlockMs - now);
  return { remaining, overdue: remaining <= 0 };
}

export function VaultDetailModal({
  vault,
  trigger,
  marker = "vault.detail",
}: VaultDetailModalProps) {
  const [open, setOpen] = useState(false);
  const vaultId = String(vault.id);
  const ledgerQuery = useGetVaultLedger(open ? vaultId : null);

  const status = vault.status as VaultStatus;
  const badge = statusBadge[status];
  const StatusIcon = badge.icon;
  const { remaining, overdue } = useCountdown(vault.unlockDate);
  const lockDurationMs = Math.max(
    0,
    Number(vault.unlockDate / 1_000_000n) -
      Number(vault.createdAt / 1_000_000n),
  );
  const percent = Math.max(0, Math.min(100, Number(vault.progressPercent)));

  const ledgerEntries = (ledgerQuery.data ?? []) as unknown as Array<
    import("@/backend").LedgerEntry
  >;

  return (
    <CryoModal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={
        <span className="flex items-center gap-2">
          <Snowflake className="h-5 w-5 text-accent" />
          {vault.goalName}
        </span>
      }
      description={vault.note || "Vault ledger history"}
      className="max-w-2xl"
    >
      <div className="relative z-10 space-y-5" data-ocid={marker}>
        {/* Status + amounts */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Frozen balance
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-gradient-frost">
              {formatAmount(vault.currentAmount)}
            </p>
            <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
              of {formatAmount(vault.targetAmount)} target
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-medium ring-1 ring-inset",
              badge.className,
            )}
            data-ocid={`${marker}.status_badge`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {badge.label}
          </span>
        </div>

        {/* Progress */}
        <CryoProgressBar percent={percent} height={10} />

        {/* Countdown + lock duration */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Ledger */}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Ledger history
          </p>
          <VaultLedgerList
            entries={ledgerEntries}
            loading={ledgerQuery.isLoading}
            marker={`${marker}.ledger`}
          />
        </div>
      </div>
    </CryoModal>
  );
}
