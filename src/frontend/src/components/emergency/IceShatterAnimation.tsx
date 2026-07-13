import { cn } from "@/lib/utils";
import { CheckCircle2, Snowflake } from "lucide-react";
/**
 * IceShatterAnimation — the climax of the Break Glass flow.
 *
 * Renders a frozen ice panel that fractures and shatters when `shatter`
 * is true, then reveals the released funds. Uses the `ice-shatter`
 * keyframe plus motion-driven shard pieces for a dramatic, consequential
 * feel. After the shards clear, shows the "Funds released" confirmation.
 */
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export interface IceShatterAnimationProps {
  /** Fire the shatter sequence when true. */
  shatter: boolean;
  /** Amount released (atomic units), shown after shards clear. */
  releasedAmount: bigint;
  /** Vault goal name, shown in the release confirmation. */
  goalName: string;
  className?: string;
}

function formatAmount(nat: bigint): string {
  return Number(nat.toString()).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

// Deterministic shard geometry — fixed so the layout is stable.
const SHARDS = [
  { x: -120, y: -80, rot: -18, delay: 0, size: 64 },
  { x: 90, y: -110, rot: 22, delay: 0.04, size: 52 },
  { x: -160, y: 40, rot: 14, delay: 0.08, size: 70 },
  { x: 140, y: 60, rot: -26, delay: 0.06, size: 58 },
  { x: -40, y: -140, rot: 8, delay: 0.02, size: 46 },
  { x: 60, y: 130, rot: -12, delay: 0.1, size: 60 },
  { x: -200, y: -20, rot: 30, delay: 0.12, size: 44 },
  { x: 200, y: -40, rot: -20, delay: 0.14, size: 50 },
];

export function IceShatterAnimation({
  shatter,
  releasedAmount,
  goalName,
  className,
}: IceShatterAnimationProps) {
  // Reveal the released-funds panel after the shards have cleared.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!shatter) {
      setRevealed(false);
      return;
    }
    const id = window.setTimeout(() => setRevealed(true), 900);
    return () => window.clearTimeout(id);
  }, [shatter]);

  const shards = useMemo(() => SHARDS, []);

  return (
    <div
      className={cn(
        "relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden",
        className,
      )}
      data-ocid="break_glass.shatter"
      aria-live="assertive"
    >
      {/* Frozen ice panel — fractures and shatters */}
      <motion.div
        className="relative flex h-44 w-44 items-center justify-center"
        initial={false}
        animate={
          shatter
            ? {
                scale: [1, 1.08, 0.92],
                opacity: [1, 0.8, 0],
                filter: ["blur(0px)", "blur(1px)", "blur(3px)"],
              }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ice block body */}
        <div
          className={cn(
            "cryo-glass-strong cryo-condensation absolute inset-0 rounded-3xl",
            "ring-1 ring-inset ring-accent/30",
            shatter && "animate-ice-shatter",
          )}
        />
        {/* Crack lines — appear just before shatter */}
        {shatter ? (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <title>Ice shatter</title>
            <motion.path
              d="M50 8 L46 38 L58 50 L42 70 L50 92"
              stroke="oklch(0.62 0.22 25 / 70%)"
              strokeWidth={0.8}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0.6] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <motion.path
              d="M50 8 L62 30 L50 44 L66 64 L50 92"
              stroke="oklch(0.62 0.22 25 / 55%)"
              strokeWidth={0.6}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.9, 0.5] }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            />
            <motion.path
              d="M50 8 L38 26 L50 40 L34 58 L50 92"
              stroke="oklch(0.62 0.22 25 / 50%)"
              strokeWidth={0.5}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.8, 0.4] }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
            />
          </svg>
        ) : null}
        {/* Central snowflake emblem */}
        <motion.div
          className="relative z-10 text-accent"
          animate={
            shatter ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.35 }}
        >
          <Snowflake className="h-16 w-16" strokeWidth={1.25} />
        </motion.div>
      </motion.div>

      {/* Flying shards — only render during shatter */}
      {shatter ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {shards.map((s, i) => (
            <motion.div
              key={`shard-${i}-${s.x}-${s.y}`}
              className="cryo-glass absolute rounded-lg ring-1 ring-inset ring-accent/40"
              style={{ width: s.size, height: s.size * 0.7 }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 0.9, scale: 1 }}
              animate={{
                x: s.x,
                y: s.y,
                rotate: s.rot * 4,
                opacity: [0.9, 0.7, 0],
                scale: [1, 0.6, 0.3],
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: s.delay,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Released funds reveal */}
      <motion.div
        className="relative z-20 mt-2 text-center"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 12 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          initial={{ scale: 0.6 }}
          animate={{ scale: revealed ? 1 : 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-inset ring-success/40"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Funds released
        </p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-gradient-frost">
          {formatAmount(releasedAmount)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Vault &ldquo;{goalName}&rdquo; — status:{" "}
          <span className="font-medium text-destructive">Broken</span>
        </p>
      </motion.div>
    </div>
  );
}
