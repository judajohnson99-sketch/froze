/**
 * ManualDepositForm — single-shot deposit into a vault.
 *
 * On submit: generates a crypto.randomUUID() idempotency key, converts
 * dollars to Nat (×1e8), calls useMakeDeposit, plays the CrystallizeAnimation
 * overlay, surfaces a CryoNotification on success, and refreshes vault data.
 * Handles DepositResult variants defensively (backend may return unknown).
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
import { useGetVaults, useMakeDeposit } from "@/hooks/useBackend";
import { Snowflake } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CrystallizeAnimation } from "./CrystallizeAnimation";

/** Dollars → Nat (e8s). Rejects non-positive / non-finite input. */
function dollarsToNat(dollars: string): bigint | null {
  const n = Number(dollars);
  if (!Number.isFinite(n) || n <= 0) return null;
  return BigInt(Math.round(n * 1e8));
}

/** Defensive vault shape — backend may return unknown. */
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

export function ManualDepositForm() {
  const { data: vaultsRaw } = useGetVaults();
  const { mutateAsync: makeDeposit, isPending } = useMakeDeposit();
  const { push } = useCryoNotifications();

  const [vaultIdSelected, setVaultIdSelected] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [crystallizing, setCrystallizing] = useState(false);

  const vaults: VaultLike[] = Array.isArray(vaultsRaw)
    ? vaultsRaw.filter(isVaultLike)
    : [];

  function validate(): { nat: bigint } | { error: string } {
    if (!vaultIdSelected) return { error: "Select a vault to freeze into." };
    const nat = dollarsToNat(amount);
    if (nat === null) return { error: "Enter a positive dollar amount." };
    return { nat };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if ("error" in v) {
      setError(v.error);
      return;
    }
    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    setCrystallizing(true);
    try {
      const result = await makeDeposit({
        vaultId: BigInt(vaultIdSelected),
        amount: v.nat,
        idempotencyKey,
        description: description.trim() || "Manual deposit",
      });
      // DepositResult variant handling — defensive since shape is unknown.
      const ok = interpretDepositResult(result);
      if (ok) {
        push({
          kind: "success",
          title: "Your deposit has been frozen.",
          description: `$${amount} sealed into the vault.`,
        });
        setAmount("");
        setDescription("");
      } else {
        push({
          kind: "warning",
          title: "Deposit recorded with a note.",
          description: "Check the ledger for details.",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Deposit failed.";
      setError(message);
      push({ kind: "warning", title: "Deposit failed.", description: message });
    } finally {
      setCrystallizing(false);
    }
  }

  return (
    <>
      <CrystallizeAnimation active={crystallizing} label="Freezing funds…" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <CryoCard
          strong
          condensation
          facet
          className="p-6 sm:p-7"
          data-ocid="deposits.manual.card"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl cryo-glass">
              <Snowflake className="h-5 w-5 text-accent" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
                Manual Freeze
              </p>
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Freeze Funds
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="manual-vault"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
              >
                Vault
              </label>
              <Select
                value={vaultIdSelected}
                onValueChange={setVaultIdSelected}
              >
                <SelectTrigger
                  id="manual-vault"
                  className="cryo-glass h-11 w-full rounded-xl text-sm text-foreground"
                  data-ocid="deposits.manual.vault.select"
                >
                  <SelectValue placeholder="Select a vault" />
                </SelectTrigger>
                <SelectContent
                  className="cryo-glass-strong rounded-xl border-border/40"
                  data-ocid="deposits.manual.vault.dropdown_menu"
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
                        data-ocid={`deposits.manual.vault.item.${i + 1}`}
                      >
                        {vaultName(v)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="manual-amount"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
              >
                Amount (USD)
              </label>
              <CryoInput
                id="manual-amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-ocid="deposits.manual.amount.input"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="manual-desc"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
              >
                Memo (optional)
              </label>
              <CryoInput
                id="manual-desc"
                type="text"
                placeholder="Paycheck, side gig, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-ocid="deposits.manual.memo.input"
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="text-xs text-destructive"
                data-ocid="deposits.manual.field_error"
              >
                {error}
              </p>
            ) : null}

            <CryoButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending || crystallizing}
              data-ocid="deposits.manual.submit_button"
            >
              <Snowflake className="h-4 w-4" />
              {crystallizing ? "Freezing…" : "Freeze Funds"}
            </CryoButton>
          </form>
        </CryoCard>
      </motion.div>
    </>
  );
}

/** Interpret a DepositResult defensively — treat truthy non-error as success. */
function interpretDepositResult(result: unknown): boolean {
  if (result == null) return true;
  if (typeof result === "boolean") return result;
  if (typeof result === "object") {
    const r = result as Record<string, unknown>;
    if ("ok" in r) return !!r.ok;
    if ("err" in r) return false;
    if ("error" in r) return false;
    return true;
  }
  return true;
}

export default ManualDepositForm;
