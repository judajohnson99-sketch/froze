import { CryoButton } from "@/components/cryo/CryoButton";
import { cn } from "@/lib/utils";
import { AlertOctagon, ShieldAlert, Snowflake } from "lucide-react";
/**
 * WarningStep — Step 1 of the Break Glass flow.
 *
 * A stark, serious warning that breaking the glass releases frozen
 * funds early, forfeits rewards, and may incur an emergency fee.
 * Dark with red/danger accents and ice-fracture visual cues. The user
 * must explicitly acknowledge to continue.
 */
import { motion } from "motion/react";

export interface WarningStepProps {
  goalName: string;
  onContinue: () => void;
  onCancel: () => void;
  className?: string;
}

const WARNINGS = [
  "Releases your frozen funds before the lock period ends.",
  "Forfeits any accrued interest rewards on this vault.",
  "May incur an emergency withdrawal fee.",
  "Resets your savings goal progress to zero.",
];

export function WarningStep({
  goalName,
  onContinue,
  onCancel,
  className,
}: WarningStepProps) {
  return (
    <div className={cn("relative", className)} data-ocid="break_glass.warning">
      {/* Danger-tinted fracture backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-destructive/10" />
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <title>Warning</title>
          <motion.path
            d="M50 0 L44 30 L58 48 L40 70 L50 100"
            stroke="oklch(0.62 0.22 25 / 60%)"
            strokeWidth={0.4}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          <motion.path
            d="M50 0 L60 24 L48 42 L62 64 L50 100"
            stroke="oklch(0.62 0.22 25 / 45%)"
            strokeWidth={0.3}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          />
        </svg>
      </div>

      {/* Headline */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative mb-4">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/40"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <AlertOctagon className="h-8 w-8" strokeWidth={1.5} />
          </motion.div>
          <Snowflake
            className="absolute -right-1 -top-1 h-5 w-5 text-accent/70"
            strokeWidth={1.5}
          />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-destructive/80">
          Emergency
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          BREAK GLASS
        </h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          You are about to emergency-unlock the vault{" "}
          <span className="font-medium text-foreground">
            &ldquo;{goalName}&rdquo;
          </span>
          . This action is irreversible.
        </p>
      </motion.div>

      {/* Warning list */}
      <motion.ul
        className="mx-auto mt-6 max-w-md space-y-2.5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.2 },
          },
        }}
      >
        {WARNINGS.map((w) => (
          <motion.li
            key={w}
            className="flex items-start gap-3 rounded-xl bg-destructive/5 px-4 py-3 ring-1 ring-inset ring-destructive/20"
            variants={{
              hidden: { opacity: 0, x: -8 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span className="text-sm text-foreground/90">{w}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* Actions */}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <CryoButton
          variant="ghost"
          size="md"
          onClick={onCancel}
          data-ocid="break_glass.warning.cancel_button"
        >
          Cancel
        </CryoButton>
        <CryoButton
          variant="danger"
          size="md"
          onClick={onContinue}
          data-ocid="break_glass.warning.continue_button"
        >
          I Understand, Continue
        </CryoButton>
      </div>
    </div>
  );
}
