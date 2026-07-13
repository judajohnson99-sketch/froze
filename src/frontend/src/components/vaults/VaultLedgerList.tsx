import { type EntryReason, EntrySide } from "@/backend";
import type { LedgerEntry } from "@/backend";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Timer,
  Unlock,
  Wrench,
} from "lucide-react";

/**
 * VaultLedgerList — frosted-glass ledger history for a single vault.
 *
 * Renders each LedgerEntry as a row: date, side (debit/credit) icon,
 * amount (signed), reason badge, and description. Credits are cyan
 * (frost flowing in), debits are warm (melt flowing out).
 *
 * Used inside VaultDetailModal.
 */
export interface VaultLedgerListProps {
  entries: LedgerEntry[];
  loading?: boolean;
  marker?: string;
}

const reasonMeta: Record<
  EntryReason,
  { label: string; icon: typeof Snowflake }
> = {
  manualDeposit: { label: "Manual deposit", icon: Snowflake },
  recurringDeposit: { label: "Recurring deposit", icon: Timer },
  vaultLock: { label: "Vault locked", icon: ShieldCheck },
  vaultUnlock: { label: "Vault unlocked", icon: Unlock },
  vaultBreak: { label: "Emergency break", icon: AlertTriangle },
  interestReward: { label: "Interest reward", icon: Gift },
  withdrawal: { label: "Withdrawal", icon: ArrowUpRight },
  jobProcessing: { label: "Job processed", icon: Wrench },
  reconciliationAdjustment: { label: "Reconciliation", icon: RefreshCw },
};

function formatAmount(nat: bigint): string {
  return Number(nat.toString()).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

function formatDate(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  if (!ms) return "—";
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VaultLedgerList({
  entries,
  loading = false,
  marker = "vault.ledger",
}: VaultLedgerListProps) {
  if (loading) {
    return (
      <div className="space-y-2" data-ocid={`${marker}.loading_state`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            key={i}
            className="cryo-glass h-14 animate-pulse rounded-xl"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        className="cryo-glass flex flex-col items-center gap-3 rounded-2xl px-6 py-10 text-center"
        data-ocid={`${marker}.empty_state`}
      >
        <Snowflake className="h-8 w-8 text-accent/60" />
        <p className="font-display text-sm text-muted-foreground">
          No ledger entries yet. The first deposit will freeze here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="cryo-glass max-h-[44vh] space-y-1.5 overflow-y-auto rounded-2xl p-2"
      data-ocid={marker}
    >
      {entries.map((entry, index) => (
        <LedgerRow
          key={`${entry.transactionId}-${index}`}
          entry={entry}
          marker={`${marker}.row.${index + 1}`}
        />
      ))}
    </div>
  );
}

function LedgerRow({
  entry,
  marker,
}: {
  entry: LedgerEntry;
  marker: string;
}) {
  const isCredit = entry.side === EntrySide.credit;
  const meta = reasonMeta[entry.reason] ?? reasonMeta.manualDeposit;
  const Icon = meta.icon;
  const signedAmount = isCredit
    ? `+${formatAmount(entry.amount)}`
    : `−${formatAmount(entry.amount)}`;

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-muted/30"
      data-ocid={marker}
    >
      {/* Side icon */}
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
          isCredit
            ? "bg-accent/10 text-accent ring-accent/30"
            : "bg-destructive/10 text-destructive ring-destructive/30",
        )}
        aria-label={isCredit ? "Credit" : "Debit"}
      >
        {isCredit ? (
          <ArrowDownLeft className="h-4 w-4" />
        ) : (
          <ArrowUpRight className="h-4 w-4" />
        )}
      </span>

      {/* Description + reason */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm text-foreground">
          {entry.description || meta.label}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
          <Icon className="h-3 w-3" />
          {meta.label}
        </p>
      </div>

      {/* Date */}
      <p className="hidden shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:block">
        {formatDate(entry.timestamp)}
      </p>

      {/* Amount */}
      <p
        className={cn(
          "shrink-0 font-mono text-sm font-semibold tabular-nums",
          isCredit ? "text-accent" : "text-destructive",
        )}
      >
        {signedAmount}
      </p>
    </div>
  );
}
