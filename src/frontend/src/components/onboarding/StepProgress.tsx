import { cn } from "@/lib/utils";
/**
 * StepProgress — 5-step cryo progress indicator for the onboarding flow.
 * Completed steps get a filled cyan core; the current step pulses with a
 * cyan glow rim; future steps stay as faint ice. Each completed step is
 * clickable to navigate back. Mobile collapses to a slim segmented bar.
 */
import { Check } from "lucide-react";
import { motion } from "motion/react";

export interface StepProgressProps {
  /** Current 1-indexed step. */
  current: number;
  /** Total number of steps. */
  total: number;
  /** Step labels, indexed 0..total-1. */
  labels: string[];
  /** Navigate to a step. Only invoked for completed steps (<= current). */
  onStepClick?: (step: number) => void;
}

export function StepProgress({
  current,
  total,
  labels,
  onStepClick,
}: StepProgressProps) {
  return (
    <div className="w-full" data-ocid="onboarding.progress">
      {/* Desktop: numbered nodes + connector */}
      <div className="hidden items-center sm:flex">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const isComplete = step < current;
          const isCurrent = step === current;
          const isFuture = step > current;
          const clickable = isComplete && !!onStepClick;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(step)}
                aria-label={`Step ${step}: ${labels[i] ?? ""}`}
                aria-current={isCurrent ? "step" : undefined}
                data-ocid={`onboarding.progress.step.${step}`}
                className={cn(
                  "group flex flex-col items-center gap-2 transition-all",
                  clickable && "cursor-pointer hover:-translate-y-0.5",
                  !clickable && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full border transition-all duration-300",
                    isComplete &&
                      "border-accent/60 bg-accent/20 text-accent shadow-[0_0_16px_oklch(0.93_0.11_200/35%)]",
                    isCurrent &&
                      "border-accent bg-accent/15 text-accent shadow-[0_0_24px_oklch(0.93_0.11_200/55%)] animate-frozen-glow-pulse",
                    isFuture &&
                      "border-border/40 bg-muted/20 text-muted-foreground/50",
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="font-mono text-xs tabular-nums">
                      {step}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
                    isCurrent && "text-accent",
                    isComplete && "text-muted-foreground",
                    isFuture && "text-muted-foreground/40",
                  )}
                >
                  {labels[i] ?? `Step ${step}`}
                </span>
              </button>
              {i < total - 1 ? (
                <div
                  className="relative mx-2 h-px flex-1 overflow-hidden rounded-pill bg-border/30"
                  aria-hidden
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-pill"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.94 0.1 200) 0%, oklch(0.62 0.19 258) 100%)",
                      boxShadow: "0 0 8px oklch(0.93 0.11 200 / 45%)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{
                      width: step < current ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile: slim segmented bar */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Step {current} / {total}
          </span>
          <span className="font-display text-xs text-muted-foreground">
            {labels[current - 1] ?? ""}
          </span>
        </div>
        <div
          className="flex gap-1.5"
          role="progressbar"
          tabIndex={0}
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          {Array.from({ length: total }, (_, i) => {
            const step = i + 1;
            const isComplete = step < current;
            const isCurrent = step === current;
            const clickable = isComplete && !!onStepClick;
            return (
              <button
                key={step}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(step)}
                aria-label={`Go to step ${step}`}
                data-ocid={`onboarding.progress.step.${step}`}
                className={cn(
                  "h-1.5 flex-1 rounded-pill transition-all duration-300",
                  clickable && "cursor-pointer",
                  isComplete && "bg-accent/70",
                  isCurrent &&
                    "bg-accent shadow-[0_0_12px_oklch(0.93_0.11_200/60%)]",
                  step > current && "bg-border/30",
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepProgress;
