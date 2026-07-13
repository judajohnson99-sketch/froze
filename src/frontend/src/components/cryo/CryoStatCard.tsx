import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
/**
 * CryoStatCard — frosted glass stat card with label, value, icon, and
 * optional trend. Uses the cryo-glass surface and a subtle entrance
 * animation via motion.
 */
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { CryoCard } from "./CryoCard";

export interface CryoStatCardProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  /** Positive number renders an up-trend, negative a down-trend. */
  trend?: number;
  /** Suffix appended to the trend value, e.g. "%". */
  trendSuffix?: string;
  className?: string;
  marker?: string;
}

export function CryoStatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendSuffix = "%",
  className,
  marker,
}: CryoStatCardProps) {
  const hasTrend = typeof trend === "number";
  const up = (trend ?? 0) >= 0;

  return (
    <CryoCard condensation className={cn("p-5", className)} data-ocid={marker}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
            {value}
          </p>
          {hasTrend ? (
            <p
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
                up ? "text-[oklch(0.78_0.15_175)]" : "text-destructive",
              )}
            >
              {up ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {up ? "+" : ""}
              {trend}
              {trendSuffix}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent shadow-cryo-cyan-glow">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </motion.div>
    </CryoCard>
  );
}
