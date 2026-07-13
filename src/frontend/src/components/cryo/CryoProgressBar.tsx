import { cn } from "@/lib/utils";
/**
 * CryoProgressBar — cyan glow progress with ice-fill animation.
 * Accepts percent 0-100. Uses motion for a smooth fill transition and
 * the cryo-edge-glow rim on the filled portion.
 */
import { motion } from "motion/react";

export interface CryoProgressBarProps {
  /** Completion 0-100. Clamped internally. */
  percent: number;
  className?: string;
  /** Show the numeric label at the right end. */
  showLabel?: boolean;
  /** Height of the track in px. */
  height?: number;
}

export function CryoProgressBar({
  percent,
  className,
  showLabel = true,
  height = 10,
}: CryoProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="relative flex-1 overflow-hidden rounded-pill bg-muted/40 ring-1 ring-inset ring-border/40"
        style={{ height }}
        role="progressbar"
        tabIndex={0}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-pill"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.62 0.19 258) 0%, oklch(0.94 0.1 200) 100%)",
            boxShadow:
              "0 0 12px oklch(0.93 0.11 200 / 45%), 0 0 24px oklch(0.62 0.19 258 / 25%)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {showLabel ? (
        <span className="font-mono text-xs tabular-nums text-muted-foreground min-w-[3ch] text-right">
          {Math.round(clamped)}%
        </span>
      ) : null}
    </div>
  );
}
