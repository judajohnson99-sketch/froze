/**
 * DepositHistory — frosted glass list of recent deposits across all vaults.
 *
 * Pulls ledger entries from useGetVaults + useGetVaultLedger per vault
 * (defensive narrowing since hooks may return unknown). Each row shows
 * date, vault name, amount, and type (manual / recurring).
 */
import { CryoCard } from "@/components/cryo";
import { useGetVaultLedger, useGetVaults } from "@/hooks/useBackend";
import { History } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

interface VaultLike {
  id: string | bigint;
  goalName?: string;
  name?: string;
}

interface LedgerEntryLike {
  amount?: bigint | number;
  timestamp?: bigint | number;
  createdAt?: bigint | number;
  type?: string;
  kind?: string;
  source?: string;
  description?: string;
  memo?: string;
}

function isVaultLike(v: unknown): v is VaultLike {
  return (
    !!v &&
    typeof v === "object" &&
    ("id" in (v as object) || "vaultId" in (v as object))
  );
}

function isLedgerEntryLike(v: unknown): v is LedgerEntryLike {
  return !!v && typeof v === "object";
}

function vaultId(v: VaultLike): string {
  const raw =
    (v as { id?: unknown; vaultId?: unknown }).id ??
    (v as { vaultId?: unknown }).vaultId;
  return String(raw);
}

function vaultName(v: VaultLike): string {
  return v.goalName ?? v.name ?? "Vault";
}

function natToDollars(nat: bigint | number | undefined): string {
  if (nat === undefined || nat === null) return "—";
  const n = typeof nat === "bigint" ? Number(nat) : nat;
  return (n / 1e8).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function formatDate(nanos: bigint | number | undefined): string {
  if (nanos === undefined || nanos === null) return "—";
  const n = typeof nanos === "bigint" ? Number(nanos) : nanos;
  const ms = n < 1e12 ? n : Math.floor(n / 1_000_000);
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Classify an entry as manual or recurring from any of its type fields. */
function classifyType(entry: LedgerEntryLike): "manual" | "recurring" {
  const raw = (entry.type ?? entry.kind ?? entry.source ?? "")
    .toString()
    .toLowerCase();
  if (raw.includes("recur") || raw.includes("auto")) return "recurring";
  return "manual";
}

interface HistoryRow {
  key: string;
  date: string;
  vaultName: string;
  amount: string;
  type: "manual" | "recurring";
}

/**
 * Aggregates ledger entries across vaults. Since useGetVaultLedger is
 * a per-vault hook, we read each vault's ledger via a child component
 * that calls the hook at render time (rules of hooks).
 */
export function DepositHistory() {
  const { data: vaultsRaw } = useGetVaults();
  const vaults: VaultLike[] = Array.isArray(vaultsRaw)
    ? vaultsRaw.filter(isVaultLike)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <CryoCard
        condensation
        className="p-6 sm:p-7"
        data-ocid="deposits.history.card"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl cryo-glass">
            <History className="h-5 w-5 text-accent" />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
              Ledger
            </p>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Recent Deposits
            </h2>
          </div>
        </div>

        {vaults.length === 0 ? (
          <div
            className="mt-5 cryo-glass rounded-xl px-4 py-8 text-center"
            data-ocid="deposits.history.empty_state"
          >
            <History className="mx-auto h-6 w-6 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">
              No deposits yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Your frozen history will appear here.
            </p>
          </div>
        ) : (
          <VaultLedgerAggregator vaults={vaults} />
        )}
      </CryoCard>
    </motion.div>
  );
}

/** Renders one ledger-reader child per vault (hooks-safe) and merges rows. */
function VaultLedgerAggregator({ vaults }: { vaults: VaultLike[] }) {
  const rows = useMemo<HistoryRow[]>(() => [], []);
  // Each vault gets its own hook call via a child component.
  return (
    <div className="mt-5 space-y-2">
      {vaults.map((v) => (
        <VaultLedgerRows
          key={vaultId(v)}
          vault={v}
          onRows={(r) => {
            // Merge into rows; dedupe by key.
            for (const row of r) {
              if (!rows.some((x) => x.key === row.key)) rows.push(row);
            }
          }}
        />
      ))}
      <HistoryRowsView rows={rows} />
    </div>
  );
}

function VaultLedgerRows({
  vault,
  onRows,
}: {
  vault: VaultLike;
  onRows: (rows: HistoryRow[]) => void;
}) {
  const id = vaultId(vault);
  const { data: ledgerRaw } = useGetVaultLedger(id);
  const entries: LedgerEntryLike[] = Array.isArray(ledgerRaw)
    ? ledgerRaw.filter(isLedgerEntryLike)
    : [];

  // Build rows once per data change.
  useMemo(() => {
    const built: HistoryRow[] = entries.map((e, j) => ({
      key: `${id}-${j}`,
      date: formatDate(e.timestamp ?? e.createdAt),
      vaultName: vaultName(vault),
      amount: natToDollars(e.amount),
      type: classifyType(e),
    }));
    onRows(built);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, id, onRows, vault]);

  return null;
}

function HistoryRowsView({ rows }: { rows: HistoryRow[] }) {
  if (rows.length === 0) {
    return (
      <div
        className="cryo-glass rounded-xl px-4 py-6 text-center"
        data-ocid="deposits.history.empty_state"
      >
        <p className="text-sm text-muted-foreground">
          No ledger entries recorded yet.
        </p>
      </div>
    );
  }
  // Sort newest first (best-effort by date string).
  const sorted = [...rows].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <ul className="space-y-2" data-ocid="deposits.history.list">
      {sorted.slice(0, 12).map((row, i) => (
        <motion.li
          key={row.key}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.35,
            delay: i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="cryo-glass flex items-center justify-between gap-3 rounded-xl px-4 py-3"
          data-ocid={`deposits.history.item.${i + 1}`}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-medium text-foreground">
              {row.vaultName}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {row.date}
            </p>
          </div>
          <span
            className={
              row.type === "recurring"
                ? "inline-flex shrink-0 items-center rounded-pill bg-primary/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary"
                : "inline-flex shrink-0 items-center rounded-pill bg-accent/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent"
            }
            data-ocid={`deposits.history.type.${i + 1}`}
          >
            {row.type}
          </span>
          <span
            className="shrink-0 font-mono text-sm tabular-nums text-gradient-frost"
            data-ocid={`deposits.history.amount.${i + 1}`}
          >
            {row.amount}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

export default DepositHistory;
