import type { VaultStats } from "@/backend";
import { CryoCard } from "@/components/cryo/CryoCard";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVaultStats } from "@/hooks/useBackend";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Vault as VaultIcon,
} from "lucide-react";
import { motion } from "motion/react";
/**
 * VaultStatistics — CryoCard with a sortable table of vault stats from
 * `useGetVaultStats`. Columns: Vault ID, User, Goal, Target, Current,
 * Deposit Count, Status. Clicking a column header toggles sort.
 */
import { useMemo, useState } from "react";
import {
  formatAmount,
  shortPrincipal,
  toBigInt,
  toText,
} from "./cryoAdminHelpers";
import { CryoEmptyState, CryoSectionHeader } from "./cryoAdminPresenters";

type SortKey =
  | "vaultId"
  | "userId"
  | "goalName"
  | "targetAmount"
  | "currentAmount"
  | "depositCount"
  | "status";
type SortDir = "asc" | "desc";

const STATUS_TONE: Record<string, string> = {
  freezing: "text-accent border-accent/40 bg-accent/10",
  thawing: "text-warning border-warning/40 bg-warning/10",
  thawed: "text-muted-foreground border-border/60 bg-muted/30",
  broken: "text-destructive border-destructive/40 bg-destructive/10",
};

function isVaultStat(v: unknown): v is VaultStats {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as VaultStats).goalName === "string" &&
    "vaultId" in (v as Record<string, unknown>)
  );
}

function principalText(p: unknown): string {
  if (typeof p === "string") return shortPrincipal(p);
  if (p && typeof p === "object" && "toText" in p) {
    try {
      return shortPrincipal((p as { toText: () => string }).toText());
    } catch {
      return "—";
    }
  }
  return toText(p);
}

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "vaultId", label: "Vault", align: "left" },
  { key: "userId", label: "User", align: "left" },
  { key: "goalName", label: "Goal", align: "left" },
  { key: "targetAmount", label: "Target", align: "right" },
  { key: "currentAmount", label: "Current", align: "right" },
  { key: "depositCount", label: "Deposits", align: "right" },
  { key: "status", label: "Status", align: "left" },
];

export function VaultStatistics() {
  const { data, isLoading } = useGetVaultStats();
  const [sortKey, setSortKey] = useState<SortKey>("currentAmount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo<VaultStats[]>(() => {
    const list = Array.isArray(data) ? data.filter(isVaultStat) : [];
    const sorted = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "goalName" || sortKey === "status") {
        return toText(a[sortKey]).localeCompare(toText(b[sortKey])) * dir;
      }
      if (sortKey === "userId") {
        return toText(a[sortKey]).localeCompare(toText(b[sortKey])) * dir;
      }
      return Number(toBigInt(a[sortKey]) - toBigInt(b[sortKey])) * dir;
    });
    return sorted;
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <CryoCard condensation className="p-5 sm:p-6" data-ocid="admin.vaults.card">
      <CryoSectionHeader
        title="Vault Statistics"
        description="Every vault in the chamber — sortable by any column."
        icon={<VaultIcon className="h-5 w-5" />}
        marker="admin.vaults.header"
      />

      <div className="mt-5 overflow-x-auto rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
              {COLUMNS.map((c) => (
                <TableHead
                  key={c.key}
                  className={`px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80 ${c.align === "right" ? "text-right" : "text-left"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(c.key)}
                    className={`inline-flex items-center gap-1 transition-colors hover:text-accent ${c.align === "right" ? "flex-row-reverse" : ""}`}
                    data-ocid={`admin.vaults.sort.${c.key}`}
                  >
                    {c.label}
                    {sortKey === c.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3 w-3 text-accent" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-accent" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.length}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  <span data-ocid="admin.vaults.loading_state">
                    Scanning the vaults…
                  </span>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length}>
                  <CryoEmptyState
                    message="No vaults yet"
                    hint="Vaults appear once users start freezing funds."
                    marker="admin.vaults.empty_state"
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.slice(0, 50).map((v, i) => {
                const status = toText(v.status).toLowerCase();
                return (
                  <motion.tr
                    key={v.vaultId.toString()}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i * 0.02, 0.4),
                    }}
                    className="border-border/40 transition-colors hover:bg-accent/5"
                    data-ocid={`admin.vaults.row.${i + 1}`}
                  >
                    <TableCell className="px-3 py-3 font-mono text-sm tabular-nums text-foreground">
                      #{toBigInt(v.vaultId).toString()}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono text-xs text-muted-foreground">
                      {principalText(v.userId)}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-foreground">
                      {toText(v.goalName)}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-sm tabular-nums text-muted-foreground">
                      {formatAmount(toBigInt(v.targetAmount))}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-sm font-semibold tabular-nums text-accent">
                      {formatAmount(toBigInt(v.currentAmount))}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-sm tabular-nums text-muted-foreground">
                      {toBigInt(v.depositCount).toString()}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`border font-mono text-[10px] uppercase tracking-[0.14em] ${STATUS_TONE[status] ?? STATUS_TONE.thawed}`}
                        data-ocid={`admin.vaults.status.${i + 1}`}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {rows.length > 50 ? (
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">
          Showing first 50 of {rows.length.toLocaleString()}
        </p>
      ) : null}
    </CryoCard>
  );
}

export default VaultStatistics;
