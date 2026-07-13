import { Check, Snowflake } from "lucide-react";
import { motion } from "motion/react";

type MilestoneVariant = "twentyFive" | "fifty" | "seventyFive" | "oneHundred";

interface MilestoneTrackerProps {
  reachedMilestones: MilestoneVariant[] | unknown;
  percent: number | unknown;
}

const MILESTONES: {
  variant: MilestoneVariant;
  label: string;
  value: number;
}[] = [
  { variant: "twentyFive", label: "25%", value: 25 },
  { variant: "fifty", label: "50%", value: 50 },
  { variant: "seventyFive", label: "75%", value: 75 },
  { variant: "oneHundred", label: "100%", value: 100 },
];

function isMilestoneArray(value: unknown): value is MilestoneVariant[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        v === "twentyFive" ||
        v === "fifty" ||
        v === "seventyFive" ||
        v === "oneHundred",
    )
  );
}

export function MilestoneTracker({ reachedMilestones }: MilestoneTrackerProps) {
  const reached = isMilestoneArray(reachedMilestones) ? reachedMilestones : [];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3"
      data-ocid="milestone.tracker"
    >
      {MILESTONES.map((m, index) => {
        const isReached = reached.includes(m.variant);
        const isCurrent =
          !isReached &&
          MILESTONES[index - 1] !== undefined &&
          reached.includes(MILESTONES[index - 1].variant);

        return (
          <motion.div
            key={m.variant}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className={[
              "relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-smooth",
              isReached
                ? "border-frost-glow/40 bg-frost-glow/10 animate-frozen-glow-pulse"
                : isCurrent
                  ? "border-glacier-blue/30 bg-glacier-blue/5"
                  : "border-border/40 bg-muted/20 opacity-50 backdrop-blur-sm",
            ].join(" ")}
            data-ocid={`milestone.item.${index + 1}`}
          >
            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full border",
                isReached
                  ? "border-frost-glow/50 bg-frost-glow/20 text-frost-glow"
                  : "border-border/50 bg-muted/30 text-muted-foreground",
              ].join(" ")}
            >
              {isReached ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                <Snowflake className="h-4 w-4" />
              )}
            </div>
            <span
              className={[
                "font-mono text-xs tracking-wider",
                isReached ? "text-frost-glow" : "text-muted-foreground",
              ].join(" ")}
            >
              {m.label}
            </span>
            {isReached && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-frost-glow shadow-[0_0_8px_var(--color-frost-glow)]" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default MilestoneTracker;
