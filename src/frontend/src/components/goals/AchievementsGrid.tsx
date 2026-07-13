import { CryoCard } from "@/components/cryo";
import { Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface Achievement {
  id: string | unknown;
  userId?: string | unknown;
  title: string | unknown;
  description: string | unknown;
  awardedAt: bigint | unknown;
}

interface AchievementsGridProps {
  achievements: Achievement[] | unknown;
}

function toStr(value: unknown, fallback = "—"): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function toDate(value: unknown): string {
  if (typeof value !== "bigint") return "—";
  try {
    return new Date(Number(value / 1_000_000n)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function isAchievementArray(value: unknown): value is Achievement[] {
  return (
    Array.isArray(value) &&
    value.every((v) => v !== null && typeof v === "object" && "id" in v)
  );
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const items = isAchievementArray(achievements) ? achievements : [];

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/50 bg-muted/20 p-10 text-center"
        data-ocid="achievements.empty_state"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/40 bg-muted/30">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-foreground">
            No achievements yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach milestones on your vaults to unlock cryo badges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      data-ocid="achievements.grid"
    >
      {items.map((a, index) => (
        <motion.div
          key={toStr(a.id, `ach-${index}`)}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
          data-ocid={`achievements.item.${index + 1}`}
        >
          <CryoCard
            tier={3}
            className="relative flex flex-col gap-3 overflow-hidden p-5"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-frost-glow/10 blur-2xl" />
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-frost-glow/40 bg-frost-glow/10 text-frost-glow shadow-[0_0_16px_var(--color-frost-glow)]">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-display text-base font-semibold text-foreground">
                  {toStr(a.title, "Achievement")}
                </h4>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {toDate(a.awardedAt)}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {toStr(a.description, "—")}
            </p>
          </CryoCard>
        </motion.div>
      ))}
    </div>
  );
}

export default AchievementsGrid;
