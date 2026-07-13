import { CryoCard, CryoProgressBar } from "@/components/cryo";
import { MilestoneTracker } from "@/components/goals/MilestoneTracker";
import { CalendarClock, Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

type MilestoneVariant = "twentyFive" | "fifty" | "seventyFive" | "oneHundred";

interface GoalTrackingCardProps {
  vaultId: string | unknown;
  goalName: string | unknown;
  targetAmount: bigint | unknown;
  currentAmount: bigint | unknown;
  percent: number | unknown;
  reachedMilestones: MilestoneVariant[] | unknown;
  estimatedCompletion?: string | unknown;
  index?: number;
}

function toNumber(value: bigint | unknown): number {
  return typeof value === "bigint" ? Number(value) : 0;
}

function toStr(value: unknown, fallback = "—"): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function toNum(value: unknown): number {
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

function tier(percent: number): 1 | 2 | 3 | 4 {
  if (percent >= 100) return 4;
  if (percent >= 75) return 3;
  if (percent >= 40) return 2;
  return 1;
}

function formatAmount(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function GoalTrackingCard({
  vaultId,
  goalName,
  targetAmount,
  currentAmount,
  percent,
  reachedMilestones,
  estimatedCompletion,
  index = 0,
}: GoalTrackingCardProps) {
  const target = toNumber(targetAmount);
  const current = toNumber(currentAmount);
  const pct = Math.min(toNum(percent), 100);
  const remaining = Math.max(target - current, 0);
  const completion = toStr(estimatedCompletion, "");
  const t = tier(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      data-ocid={`goal_tracking.card.${index + 1}`}
    >
      <CryoCard tier={t} className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Vault · {toStr(vaultId, "—").slice(0, 8)}
            </p>
            <h3 className="mt-1 truncate font-display text-lg font-semibold text-foreground sm:text-xl">
              {toStr(goalName, "Untitled Goal")}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-frost-glow/30 bg-frost-glow/5 px-3 py-1.5">
            <Target className="h-3.5 w-3.5 text-frost-glow" />
            <span className="font-mono text-xs text-frost-glow">Goal</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Progress
            </p>
            <p className="text-gradient-cryo font-display text-4xl font-bold leading-none sm:text-5xl">
              {pct.toFixed(0)}%
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Current / Target
            </p>
            <p className="font-mono text-sm text-foreground">
              {formatAmount(current)} / {formatAmount(target)}
            </p>
          </div>
        </div>

        <CryoProgressBar percent={pct} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> Remaining
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">
              {formatAmount(remaining)}
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <CalendarClock className="h-3 w-3" /> Est. Completion
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">
              {completion || "Set up recurring deposits to estimate"}
            </p>
          </div>
        </div>

        <MilestoneTracker reachedMilestones={reachedMilestones} percent={pct} />
      </CryoCard>
    </motion.div>
  );
}

export default GoalTrackingCard;
