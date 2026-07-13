import { CryoButton, CryoInput } from "@/components/cryo";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { type ChangeEvent, useState } from "react";

/**
 * AmountStep — Step 3 of 5. Enter a target savings amount in dollars.
 * Large display of the entered amount, quick-select chips for common
 * values, and a CryoInput for precise entry.
 */
export interface AmountStepProps {
  /** Current target amount in dollars (whole). null = unset. */
  value: number | null;
  onChange: (amount: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

const QUICK_AMOUNTS = [500, 1000, 5000, 10000];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AmountStep({
  value,
  onChange,
  onContinue,
  onBack,
}: AmountStepProps) {
  const [draft, setDraft] = useState<string>(value ? String(value) : "");

  const commit = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    setDraft(cleaned);
    const parsed = cleaned ? Number.parseInt(cleaned, 10) : 0;
    if (parsed > 0) onChange(parsed);
  };

  const handleQuick = (amount: number) => {
    setDraft(String(amount));
    onChange(amount);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    commit(e.target.value);
  };

  const displayAmount = value ?? 0;
  const canContinue = !!value && value > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80">
          Set your target
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How much will you freeze?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the total you intend to save. We'll track your progress toward
          it.
        </p>
      </header>

      {/* Large display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="cryo-glass-strong cryo-condensation relative mb-6 overflow-hidden rounded-2xl p-8 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Target amount
        </p>
        <motion.p
          key={displayAmount}
          initial={{ opacity: 0.6, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-3 font-display text-5xl font-semibold tabular-nums text-gradient-frost sm:text-6xl"
        >
          {formatCurrency(displayAmount)}
        </motion.p>
      </motion.div>

      {/* Input */}
      <div className="space-y-2">
        <label
          htmlFor="amount-input"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Enter amount (USD)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
            $
          </span>
          <CryoInput
            id="amount-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={draft}
            onChange={handleInput}
            data-ocid="onboarding.amount.input"
            className="pl-8 text-lg font-mono tabular-nums"
          />
        </div>
      </div>

      {/* Quick select */}
      <div className="mt-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Quick select
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_AMOUNTS.map((amt, i) => {
            const active = value === amt;
            return (
              <motion.button
                key={amt}
                type="button"
                onClick={() => handleQuick(amt)}
                data-ocid={`onboarding.amount.quick.${amt}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className={cn(
                  "cryo-glass rounded-xl px-3 py-3 font-mono text-sm tabular-nums transition-all duration-300",
                  active
                    ? "cryo-edge-glow ring-2 ring-accent/60 text-accent"
                    : "text-foreground hover:ring-1 hover:ring-accent/30",
                )}
              >
                {formatCurrency(amt)}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <CryoButton
          variant="ghost"
          size="md"
          onClick={onBack}
          data-ocid="onboarding.amount.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </CryoButton>
        <CryoButton
          variant="primary"
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
          data-ocid="onboarding.amount.continue_button"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </CryoButton>
      </div>
    </div>
  );
}

export default AmountStep;
