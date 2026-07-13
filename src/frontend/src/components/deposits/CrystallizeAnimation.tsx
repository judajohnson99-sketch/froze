import { Snowflake } from "lucide-react";
/**
 * CrystallizeAnimation — full-viewport overlay that plays the signature
 * "money freezing into ice crystals" microinteraction while a deposit
 * is processing. Uses the CSS `crystallize` keyframe for the central
 * crystal burst plus motion-driven radial shards, drifting particles,
 * and a frost-spread veil. Honors prefers-reduced-motion.
 */
import { AnimatePresence, motion } from "motion/react";

export interface CrystallizeAnimationProps {
  /** When true, the overlay is visible and animating. */
  active: boolean;
  /** Optional label shown beneath the crystal. */
  label?: string;
}

/** Six radial shard offsets for the crystal burst. */
const SHARDS = Array.from({ length: 6 }, (_, i) => i);

export function CrystallizeAnimation({
  active,
  label = "Freezing funds…",
}: CrystallizeAnimationProps) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.output
          key="crystallize-overlay"
          className="pointer-events-none fixed inset-0 z-[90] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-live="assertive"
          data-ocid="deposits.crystallize.loading_state"
        >
          {/* Frosted dimming veil */}
          <div
            aria-hidden
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          {/* Frost spreading from center */}
          <motion.div
            aria-hidden
            className="animate-frost-spreading absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.93 0.11 200 / 22%) 0%, transparent 60%)",
            }}
          />

          {/* Crystal core + radial shards */}
          <div className="relative grid place-items-center">
            {/* Outer rotating halo */}
            <motion.div
              aria-hidden
              className="absolute h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.93 0.11 200 / 28%) 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.1, 1], opacity: [0, 0.9, 0.7] }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Radial crystal shards */}
            {SHARDS.map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute block"
                style={{
                  width: 3,
                  height: 90,
                  borderRadius: 9999,
                  transformOrigin: "center bottom",
                  rotate: `${i * 60}deg`,
                  translateY: -50,
                  background:
                    "linear-gradient(to top, oklch(0.93 0.11 200 / 0%) 0%, oklch(0.94 0.1 200 / 70%) 100%)",
                  boxShadow: "0 0 12px oklch(0.93 0.11 200 / 50%)",
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 0.85], opacity: [0, 1, 0.6] }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.06,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}

            {/* Central crystal (CSS crystallize keyframe) */}
            <motion.div
              className="animate-crystallize relative grid h-24 w-24 place-items-center rounded-2xl cryo-glass-strong"
              style={{ animationIterationCount: "infinite" }}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Snowflake className="h-10 w-10 text-accent" />
              {/* Inner glow pulse */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow:
                    "0 0 32px oklch(0.93 0.11 200 / 45%), inset 0 0 24px oklch(0.94 0.1 200 / 30%)",
                }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{
                  duration: 1.4,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </motion.div>

            {/* Drifting ice particles */}
            {Array.from({ length: 10 }, (_, i) => (
              <motion.span
                key={`particle-${i}-${i % 3}`}
                aria-hidden
                className="absolute block h-1.5 w-1.5 rounded-full"
                style={{
                  background: "oklch(0.94 0.1 200 / 80%)",
                  boxShadow: "0 0 6px oklch(0.93 0.11 200 / 70%)",
                  left: `${10 + i * 8}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [-10, -60], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 2 + (i % 3),
                  ease: "easeOut",
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>

          {/* Label */}
          <motion.p
            className="absolute bottom-[38%] font-mono text-xs uppercase tracking-[0.3em] text-accent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {label}
          </motion.p>
        </motion.output>
      ) : null}
    </AnimatePresence>
  );
}

export default CrystallizeAnimation;
