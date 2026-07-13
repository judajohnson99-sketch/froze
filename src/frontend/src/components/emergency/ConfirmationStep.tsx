import { CryoButton } from "@/components/cryo/CryoButton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Lock, Percent } from "lucide-react";
/**
 * ConfirmationStep — Steps 2 & 3 of the Break Glass flow.
 *
 * Step 2: 3 confirmation checkboxes the user must check before they
 * can proceed. The "Proceed to Break Glass" button stays disabled
 * until all are checked.
 *
 * Step 3: Optional emergency fee display. Shows the fee (percentage or
 * flat), the gross amount, and the net amount released after the fee.
 * The "Confirm Emergency Withdrawal" button advances to cooling-off.
 */
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export interface ConfirmationStepProps {
  /** Vault goal name. */
  goalName: string;
  /** Gross frozen amount (atomic units). */
  currentAmount: bigint;
  /** Emergency fee as a fraction of 1 (e.g. 0.05 = 5%). */
  feeFraction: number;
  onConfirm: (netAmount: bigint) => void;
  onBack: () => void;
  className?: string;
}

const CONFIRMATIONS = [
  "I understand my savings goal will be reset.",
  "I understand I may forfeit any accrued rewards.",
  "I understand an emergency fee may apply.",
];

function formatAmount(nat: bigint): string {
  return Number(nat.toString()).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export function ConfirmationStep({
  goalName,
  currentAmount,
  feeFraction,
  onConfirm,
  onBack,
  className,
}: ConfirmationStepProps) {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const allChecked = checked.every(Boolean);

  const { feeAmount, netAmount, feePercent } = useMemo(() => {
    // Compute fee in atomic units, rounding down.
    const fee =
      (currentAmount * BigInt(Math.floor(feeFraction * 1000))) / 1000n;
    const net = currentAmount - fee;
    return {
      feeAmount: fee,
      netAmount: net,
      feePercent: Math.round(feeFraction * 100),
    };
  }, [currentAmount, feeFraction]);

  return (
    <div
      className={cn("relative", className)}
      data-ocid="break_glass.confirmation"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-destructive/80">
          Confirm the consequences
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
          Acknowledge before breaking
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Vault &ldquo;{goalName}&rdquo; — check each box to continue.
        </p>
      </motion.div>

      {/* Confirmation checkboxes */}
      <ul className="mt-5 space-y-3">
        {CONFIRMATIONS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex items-start gap-3 rounded-xl px-4 py-3 ring-1 ring-inset transition-colors duration-300",
              checked[i]
                ? "bg-destructive/10 ring-destructive/30"
                : "bg-muted/30 ring-border/40",
            )}
          >
            <Checkbox
              id={`break-glass-confirm-${i}`}
              checked={checked[i]}
              onCheckedChange={(v) =>
                setChecked((prev) => {
                  const next = [...prev];
                  next[i] = v === true;
                  return next;
                })
              }
              className="mt-0.5 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=checked]:text-destructive-foreground"
              data-ocid={`break_glass.confirmation.checkbox.${i + 1}`}
            />
            <label
              htmlFor={`break-glass-confirm-${i}`}
              className="cursor-pointer text-sm text-foreground/90"
            >
              {label}
            </label>
          </li>
        ))}
      </ul>

      {/* Fee breakdown */}
      <motion.div
        className="cryo-glass mt-6 rounded-2xl p-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-destructive" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Emergency fee · {feePercent}%
          </p>
        </div>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Frozen balance</dt>
            <dd className="font-mono tabular-nums text-foreground">
              {formatAmount(currentAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Emergency fee</dt>
            <dd className="font-mono tabular-nums text-destructive">
              −{formatAmount(feeAmount)}
            </dd>
          </div>
          <div className="h-px bg-border/40" />
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 font-medium text-foreground">
              <Lock className="h-3.5 w-3.5 text-accent" />
              Released to you
            </dt>
            <dd className="font-mono text-lg font-semibold tabular-nums text-gradient-frost">
              {formatAmount(netAmount)}
            </dd>
          </div>
        </dl>
      </motion.div>

      {/* Actions */}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <CryoButton
          variant="ghost"
          size="md"
          onClick={onBack}
          data-ocid="break_glass.confirmation.back_button"
        >
          Back
        </CryoButton>
        <CryoButton
          variant="danger"
          size="md"
          disabled={!allChecked}
          onClick={() => onConfirm(netAmount)}
          data-ocid="break_glass.confirmation.submit_button"
          aria-disabled={!allChecked}
        >
          {allChecked
            ? "Confirm Emergency Withdrawal"
            : "Check all boxes to continue"}
        </CryoButton>
      </div>
    </div>
  );
}
