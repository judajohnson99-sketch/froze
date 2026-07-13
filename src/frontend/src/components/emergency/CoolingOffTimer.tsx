import { CryoButton } from "@/components/cryo/CryoButton";
import { cn } from "@/lib/utils";
import { Snowflake, Timer, X } from "lucide-react";
/**
 * CoolingOffTimer — Step 4 of the Break Glass flow.
 *
 * After the user confirms, a cooling-off timer counts down (default
 * 10s). During this window the user can cancel — creating psychological
 * friction before the irreversible release. When the timer reaches zero,
 * `onComplete` fires so the parent can trigger the shatter animation
 * and write the ledger entry.
 */
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface CoolingOffTimerProps {
  /** Cooling-off duration in seconds. */
  durationSeconds?: number;
  /** Net amount that will be released (atomic units), shown for emphasis. */
  netAmount: bigint;
  onComplete: () => void;
  onCancel: () => void;
  className?: string;
}

function formatAmount(nat: bigint): string {
  return Number(nat.toString()).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export function CoolingOffTimer({
  durationSeconds = 10,
  netAmount,
  onComplete,
  onCancel,
  className,
}: CoolingOffTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const completedRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, onComplete]);

  const progress = ((durationSeconds - remaining) / durationSeconds) * 100;
  const isCritical = remaining <= 3;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center text-center",
        className,
      )}
      data-ocid="break_glass.cooling_off"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-destructive/80">
          Cooling off
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
          Final moment to stop
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your funds will be released in{" "}
          <span
            className={cn(
              "font-mono font-semibold tabular-nums",
              isCritical ? "text-destructive" : "text-foreground",
            )}
          >
            {remaining}
          </span>{" "}
          second{remaining === 1 ? "" : "s"}. Cancel now to keep your vault
          frozen.
        </p>
      </motion.div>

      {/* Circular countdown */}
      <div className="relative mt-6 h-40 w-40">
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <title>Countdown</title>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="oklch(0.86 0.015 240 / 12%)"
            strokeWidth="3"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={
              isCritical
                ? "oklch(0.62 0.22 25 / 80%)"
                : "oklch(0.93 0.11 200 / 80%)"
            }
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 44}
            initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 44 * (1 - progress / 100),
            }}
            transition={{ duration: 1, ease: "linear" }}
            style={{
              filter: isCritical
                ? "drop-shadow(0 0 6px oklch(0.62 0.22 25 / 50%))"
                : "drop-shadow(0 0 6px oklch(0.93 0.11 200 / 45%))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Timer
            className={cn(
              "h-5 w-5",
              isCritical ? "text-destructive" : "text-accent",
            )}
          />
          <motion.span
            key={remaining}
            initial={{ scale: 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-1 font-mono text-4xl font-bold tabular-nums",
              isCritical ? "text-destructive" : "text-foreground",
            )}
          >
            {remaining}
          </motion.span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            seconds
          </span>
        </div>
        {/* Pulsing frost ring while waiting */}
        {!isCritical ? (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-accent/30"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.04, 1] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ) : null}
      </div>

      {/* Net amount reminder */}
      <div className="cryo-glass mt-6 flex items-center gap-3 rounded-xl px-4 py-3">
        <Snowflake className="h-4 w-4 text-accent" />
        <span className="text-sm text-muted-foreground">Releasing</span>
        <span className="font-mono text-base font-semibold tabular-nums text-gradient-frost">
          {formatAmount(netAmount)}
        </span>
      </div>

      {/* Cancel — prominent during cooling-off */}
      <div className="mt-7 w-full">
        <CryoButton
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onCancel}
          data-ocid="break_glass.cooling_off.cancel_button"
        >
          <X className="h-4 w-4" />
          Cancel — Keep Frozen
        </CryoButton>
      </div>
    </div>
  );
}
