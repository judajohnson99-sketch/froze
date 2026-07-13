import { CryoButton, CryoCard } from "@/components/cryo";
import { useCreateVault } from "@/hooks/useBackend";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  type LucideIcon,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { DURATION_OPTIONS, type DurationSelection } from "./DurationStep";
import { GOAL_OPTIONS, type SavingsGoal } from "./GoalStep";

/**
 * CreateVaultStep — Step 5 of 5. Summarize selections and create the
 * first vault. On submit, calls `useCreateVault` with the assembled
 * CreateVaultRequest and plays the `ice-grows-outward` animation while
 * the mutation is in flight. On success, navigates to /dashboard.
 */
export interface CreateVaultStepProps {
  goal: SavingsGoal;
  targetAmount: number;
  duration: DurationSelection;
  /** Pre-computed lock duration in nanoseconds. */
  lockDurationNs: bigint;
  onBack: () => void;
}

interface SummaryRow {
  label: string;
  value: string;
  icon: LucideIcon;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CreateVaultStep({
  goal,
  targetAmount,
  duration,
  lockDurationNs,
  onBack,
}: CreateVaultStepProps) {
  const createVault = useCreateVault();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const goalOpt = GOAL_OPTIONS.find((g) => g.id === goal);
  const durationOpt = DURATION_OPTIONS.find((d) => d.id === duration.preset);

  const rows: SummaryRow[] = [
    {
      label: "Goal",
      value: goalOpt?.label ?? goal,
      icon: goalOpt?.icon ?? Sparkles,
    },
    {
      label: "Target amount",
      value: formatCurrency(targetAmount),
      icon: Snowflake,
    },
    {
      label: "Freeze duration",
      value:
        duration.preset === "custom" && duration.customDate
          ? `Until ${new Date(duration.customDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`
          : (durationOpt?.label ?? "—"),
      icon: Lock,
    },
  ];

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createVault.mutateAsync({
        goalName: goalOpt?.label ?? goal,
        targetAmount: BigInt(targetAmount),
        lockDurationNs,
        note: "",
      } as unknown as Record<string, unknown>);
      // Give the ice-grows-outward animation a beat to play.
      await new Promise((r) => setTimeout(r, 1400));
      navigate({ to: "/dashboard" });
    } catch {
      setCreating(false);
    }
  };

  // If the mutation errors, surface it briefly.
  useEffect(() => {
    if (createVault.isError) setCreating(false);
  }, [createVault.isError]);

  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Ice-grows-outward overlay while creating */}
      {creating ? (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ice-grows-outward rounded-full bg-accent/30 blur-2xl" />
            <div
              className="absolute inset-0 animate-ice-grows-outward rounded-full bg-accent/20 blur-xl"
              style={{ animationDelay: "0.3s" }}
            />
            <span className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-accent/50 shadow-[0_0_64px_oklch(0.93_0.11_200/40%)]">
              <Snowflake className="h-16 w-16 animate-frozen-glow-pulse text-accent" />
            </span>
            <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Crystallizing vault…
            </p>
          </div>
        </div>
      ) : null}

      <header className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80">
          Final step
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Seal your first vault
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Review your selections and freeze your savings on ice.
        </p>
      </header>

      <CryoCard strong condensation facet className="p-6">
        <div className="relative z-10 space-y-4">
          {rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 rounded-xl bg-muted/20 px-4 py-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/40 to-accent/30 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {row.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CryoCard>

      {createVault.isError ? (
        <p
          className="mt-4 text-center text-sm text-destructive"
          data-ocid="onboarding.create.error_state"
          role="alert"
        >
          Couldn't freeze the vault.{" "}
          {createVault.error?.message ?? "Try again."}
        </p>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-3">
        <CryoButton
          variant="ghost"
          size="md"
          onClick={onBack}
          disabled={creating}
          data-ocid="onboarding.create.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </CryoButton>
        <CryoButton
          variant="primary"
          size="lg"
          onClick={handleCreate}
          disabled={creating}
          data-ocid="onboarding.create.submit_button"
        >
          {creating ? (
            <>
              <Snowflake className="h-4 w-4 animate-frozen-glow-pulse" />
              Freezing…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Create Vault
            </>
          )}
        </CryoButton>
      </div>
    </div>
  );
}

export default CreateVaultStep;
