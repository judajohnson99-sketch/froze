import { AchievementsGrid } from "@/components/goals/AchievementsGrid";
import { GoalTrackingCard } from "@/components/goals/GoalTrackingCard";
import { useGetAchievements, useGetVaults } from "@/hooks/useBackend";
import { Snowflake, Target } from "lucide-react";
import { motion } from "motion/react";

interface Vault {
  id: string | unknown;
  name?: string | unknown;
  goalName?: string | unknown;
  targetAmount?: bigint | unknown;
  currentAmount?: bigint | unknown;
  percent?: number | unknown;
  reachedMilestones?: unknown;
  estimatedCompletion?: string | unknown;
}

function isVaultArray(value: unknown): value is Vault[] {
  return (
    Array.isArray(value) &&
    value.every((v) => v !== null && typeof v === "object" && "id" in v)
  );
}

function toStr(value: unknown, fallback = "—"): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function GoalsPage() {
  const { data: vaultsData } = useGetVaults();
  const { data: achievementsData } = useGetAchievements();

  const vaults = isVaultArray(vaultsData) ? vaultsData : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 flex flex-col gap-3"
        data-ocid="goals.page.header"
      >
        <div className="flex items-center gap-2">
          <Snowflake className="h-5 w-5 text-frost-glow" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-frost-glow">
            Cryo Vault · Goal Tracking
          </span>
        </div>
        <h1 className="text-gradient-cryo font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Frozen Goals
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Track each vault's progress toward its target. Milestones crystallize
          as you deposit. Lock the freeze when you reach 100%.
        </p>
      </motion.header>

      <section
        className="mb-14"
        data-ocid="goals.vaults.section"
        aria-labelledby="vaults-heading"
      >
        <div className="mb-5 flex items-center gap-2">
          <Target className="h-4 w-4 text-glacier-blue" />
          <h2
            id="vaults-heading"
            className="font-display text-lg font-semibold text-foreground sm:text-xl"
          >
            Active Vault Goals
          </h2>
        </div>

        {vaults.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/50 bg-muted/20 p-12 text-center"
            data-ocid="goals.vaults.empty_state"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-frost-glow/30 bg-frost-glow/5">
              <Snowflake className="h-7 w-7 text-frost-glow" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                No vaults frozen yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first vault to start tracking a savings goal. Each
                vault locks progress as it freezes toward its target.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {vaults.map((v, i) => (
              <GoalTrackingCard
                key={toStr(v.id, `vault-${i}`)}
                vaultId={v.id}
                goalName={v.goalName ?? v.name}
                targetAmount={v.targetAmount}
                currentAmount={v.currentAmount}
                percent={v.percent}
                reachedMilestones={v.reachedMilestones}
                estimatedCompletion={v.estimatedCompletion}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      <section
        className="rounded-2xl border border-border/40 bg-muted/30 p-5 sm:p-7"
        data-ocid="goals.achievements.section"
        aria-labelledby="achievements-heading"
      >
        <div className="mb-5 flex items-center gap-2">
          <Snowflake className="h-4 w-4 text-frost-glow" />
          <h2
            id="achievements-heading"
            className="font-display text-lg font-semibold text-foreground sm:text-xl"
          >
            Cryo Achievements
          </h2>
        </div>
        <AchievementsGrid achievements={achievementsData} />
      </section>
    </div>
  );
}
