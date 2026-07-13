/**
 * RecurringDepositList — frosted glass list of active recurring deposits.
 *
 * Each row shows vault name, amount, cadence, next-run date, active
 * status, and a cancel CryoButton that calls useCancelRecurringDeposit.
 * Defensive narrowing since useGetRecurringDeposits may return unknown.
 */
import { CryoButton, CryoCard } from "@/components/cryo";
import {
  useCancelRecurringDeposit,
  useGetRecurringDeposits,
  useGetVaults,
} from "@/hooks/useBackend";
import { Repeat, XCircle } from "lucide-react";
import { motion } from "motion/react";

interface VaultLike {
  id: string | bigint;
  goalName?: string;
  name?: string;
}

interface RecurringLike {
  id?: string | bigint;
  vaultId?: string | bigint;
  amount?: bigint | number;
  cadence?: string;
  nextRunAt?: bigint | number;
  active?: boolean;
}

function isVaultLike(v: unknown): v is VaultLike {
  return (
    !!v &&
    typeof v === "object" &&
    ("id" in (v as object) || "vaultId" in (v as object))
  );
}

function isRecurringLike(v: unknown): v is RecurringLike {
  return (
    !!v &&
    typeof v === "object" &&
    ("id" in (v as object) || "vaultId" in (v as object))
  );
}

function vaultNameFor(vaults: VaultLike[], vaultId: string | bigint): string {
  const id = String(vaultId);
  const v = vaults.find((x) => String(x.id) === id);
  return v?.goalName ?? v?.name ?? "Vault";
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

function cadenceLabel(c: string | undefined): string {
  if (!c) return "—";
  const s = String(c).toLowerCase();
  if (s.includes("week")) return "Weekly";
  if (s.includes("month")) return "Monthly";
  if (s.includes("daily")) return "Daily";
  return c;
}

export function RecurringDepositList() {
  const { data: recurringRaw, isLoading } = useGetRecurringDeposits();
  const { data: vaultsRaw } = useGetVaults();
  const { mutateAsync: cancelRecurring, isPending } =
    useCancelRecurringDeposit();

  const vaults: VaultLike[] = Array.isArray(vaultsRaw)
    ? vaultsRaw.filter(isVaultLike)
    : [];
  const items: RecurringLike[] = Array.isArray(recurringRaw)
    ? recurringRaw.filter(isRecurringLike)
    : [];

  async function handleCancel(id: string | bigint) {
    try {
      await cancelRecurring({ id: BigInt(String(id)) });
    } catch {
      // Swallow — toast layer can surface; keep list responsive.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <CryoCard
        condensation
        className="p-6 sm:p-7"
        data-ocid="deposits.recurring_list.card"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl cryo-glass">
            <Repeat className="h-5 w-5 text-accent" />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
              Active Schedules
            </p>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Recurring Deposits
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div
            className="mt-5 space-y-3"
            data-ocid="deposits.recurring_list.loading_state"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="cryo-glass h-16 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="mt-5 cryo-glass rounded-xl px-4 py-8 text-center"
            data-ocid="deposits.recurring_list.empty_state"
          >
            <Repeat className="mx-auto h-6 w-6 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">
              No recurring deposits scheduled.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Schedule one to let the vault fill itself.
            </p>
          </div>
        ) : (
          <ul
            className="mt-5 space-y-3"
            data-ocid="deposits.recurring_list.list"
          >
            {items.map((item, i) => {
              const id = String(item.id ?? item.vaultId ?? i);
              const vName = vaultNameFor(vaults, item.vaultId ?? id);
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="cryo-glass flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
                  data-ocid={`deposits.recurring_list.item.${i + 1}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-medium text-foreground">
                      {vName}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {natToDollars(item.amount)} · {cadenceLabel(item.cadence)}{" "}
                      · next {formatDate(item.nextRunAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        item.active === false
                          ? "inline-flex items-center gap-1.5 rounded-pill bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                          : "inline-flex items-center gap-1.5 rounded-pill bg-accent/15 px-3 py-1 text-xs text-accent"
                      }
                      data-ocid={`deposits.recurring_list.status.${i + 1}`}
                    >
                      <span
                        className={
                          item.active === false
                            ? "h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                            : "h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
                        }
                      />
                      {item.active === false ? "Paused" : "Active"}
                    </span>
                    <CryoButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending || item.active === false}
                      onClick={() => handleCancel(item.id ?? id)}
                      aria-label={`Cancel recurring deposit for ${vName}`}
                      data-ocid={`deposits.recurring_list.cancel_button.${i + 1}`}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </CryoButton>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CryoCard>
    </motion.div>
  );
}

export default RecurringDepositList;
