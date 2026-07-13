/**
 * RecurringDepositForm — schedule a recurring deposit into a vault.
 *
 * Cadence select offers weekly / biweekly / monthly. The backend
 * RecurringCadence variant has no biweekly, so "Biweekly" maps to
 * weekly (per project learnings). Calls useSetupRecurringDeposit.
 */
import {
  CryoButton,
  CryoCard,
  CryoInput,
  useCryoNotifications,
} from "@/components/cryo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetVaults, useSetupRecurringDeposit } from "@/hooks/useBackend";
import { Repeat } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type UiCadence = "weekly" | "biweekly" | "monthly";

/** UI cadence → backend cadence tag. Biweekly collapses to weekly. */
function toBackendCadence(c: UiCadence): string {
  if (c === "biweekly") return "weekly";
  return c; // weekly | monthly match backend variant tags
}

interface VaultLike {
  id: string | bigint;
  goalName?: string;
  name?: string;
}

function isVaultLike(v: unknown): v is VaultLike {
  return (
    !!v &&
    typeof v === "object" &&
    ("id" in (v as object) || "vaultId" in (v as object))
  );
}

function vaultId(v: VaultLike): string {
  const raw =
    (v as { id?: unknown; vaultId?: unknown }).id ??
    (v as { vaultId?: unknown }).vaultId;
  return String(raw);
}

function vaultName(v: VaultLike): string {
  return v.goalName ?? v.name ?? "Unnamed vault";
}

function dollarsToNat(dollars: string): bigint | null {
  const n = Number(dollars);
  if (!Number.isFinite(n) || n <= 0) return null;
  return BigInt(Math.round(n * 1e8));
}

export function RecurringDepositForm() {
  const { data: vaultsRaw } = useGetVaults();
  const { mutateAsync: setupRecurring, isPending } = useSetupRecurringDeposit();
  const { push } = useCryoNotifications();

  const [vaultIdSelected, setVaultIdSelected] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [cadence, setCadence] = useState<UiCadence>("weekly");
  const [error, setError] = useState<string | null>(null);

  const vaults: VaultLike[] = Array.isArray(vaultsRaw)
    ? vaultsRaw.filter(isVaultLike)
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!vaultIdSelected) {
      setError("Select a vault.");
      return;
    }
    const nat = dollarsToNat(amount);
    if (nat === null) {
      setError("Enter a positive dollar amount.");
      return;
    }
    try {
      await setupRecurring({
        vaultId: BigInt(vaultIdSelected),
        amount: nat,
        cadence: toBackendCadence(cadence),
      });
      push({
        kind: "success",
        title: "Recurring deposit scheduled.",
        description: `$${amount} ${cadence} into the vault.`,
      });
      setAmount("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scheduling failed.";
      setError(message);
      push({
        kind: "warning",
        title: "Scheduling failed.",
        description: message,
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <CryoCard
        condensation
        facet
        className="p-6 sm:p-7"
        data-ocid="deposits.recurring.card"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl cryo-glass">
            <Repeat className="h-5 w-5 text-accent" />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
              Auto-Freeze
            </p>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Schedule Recurring Deposit
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="recur-vault"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
            >
              Vault
            </label>
            <Select value={vaultIdSelected} onValueChange={setVaultIdSelected}>
              <SelectTrigger
                id="recur-vault"
                className="cryo-glass h-11 w-full rounded-xl text-sm text-foreground"
                data-ocid="deposits.recurring.vault.select"
              >
                <SelectValue placeholder="Select a vault" />
              </SelectTrigger>
              <SelectContent
                className="cryo-glass-strong rounded-xl border-border/40"
                data-ocid="deposits.recurring.vault.dropdown_menu"
              >
                {vaults.length === 0 ? (
                  <SelectItem value="__none" disabled>
                    No vaults yet
                  </SelectItem>
                ) : (
                  vaults.map((v, i) => (
                    <SelectItem
                      key={vaultId(v)}
                      value={vaultId(v)}
                      data-ocid={`deposits.recurring.vault.item.${i + 1}`}
                    >
                      {vaultName(v)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="recur-amount"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
              >
                Amount (USD)
              </label>
              <CryoInput
                id="recur-amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-ocid="deposits.recurring.amount.input"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="recur-cadence"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
              >
                Cadence
              </label>
              <Select
                value={cadence}
                onValueChange={(v) => setCadence(v as UiCadence)}
              >
                <SelectTrigger
                  id="recur-cadence"
                  className="cryo-glass h-11 w-full rounded-xl text-sm text-foreground"
                  data-ocid="deposits.recurring.cadence.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="cryo-glass-strong rounded-xl border-border/40"
                  data-ocid="deposits.recurring.cadence.dropdown_menu"
                >
                  <SelectItem
                    value="weekly"
                    data-ocid="deposits.recurring.cadence.item.1"
                  >
                    Weekly
                  </SelectItem>
                  <SelectItem
                    value="biweekly"
                    data-ocid="deposits.recurring.cadence.item.2"
                  >
                    Biweekly
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    data-ocid="deposits.recurring.cadence.item.3"
                  >
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="text-xs text-destructive"
              data-ocid="deposits.recurring.field_error"
            >
              {error}
            </p>
          ) : null}

          <CryoButton
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={isPending}
            data-ocid="deposits.recurring.submit_button"
          >
            <Repeat className="h-4 w-4" />
            {isPending ? "Scheduling…" : "Schedule Recurring Deposit"}
          </CryoButton>
        </form>
      </CryoCard>
    </motion.div>
  );
}

export default RecurringDepositForm;
