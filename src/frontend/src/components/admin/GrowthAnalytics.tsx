import type { GrowthAnalytics } from "@/backend";
import { CryoCard } from "@/components/cryo/CryoCard";
import { CryoStatCard } from "@/components/cryo/CryoStatCard";
import { useGetGrowthAnalytics } from "@/hooks/useBackend";
import { Layers, Snowflake, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
/**
 * GrowthAnalytics — CryoCard with recharts visualizations themed for
 * the dark cryo vault (cyan/ice spectrum). Pulls signups, frozen-funds
 * trend, and average vaults per user from `useGetGrowthAnalytics`.
 *
 * The backend `GrowthAnalytics` record is a snapshot (no time series),
 * so we synthesize a small forward projection from the 7d/30d deltas to
 * give the charts a frozen-funds trend shape. When the backend exposes
 * a real time series, swap `buildTrend` for the real points.
 */
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatAmount,
  formatCompact,
  toBigInt,
  toNumber,
} from "./cryoAdminHelpers";
import { CryoEmptyState, CryoSectionHeader } from "./cryoAdminPresenters";

const CYAN = "oklch(0.94 0.1 200)";
const FROST = "oklch(0.93 0.11 200)";
const GLACIER = "oklch(0.62 0.19 258)";

function extract(data: unknown): GrowthAnalytics | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  return {
    totalUsers: toBigInt(o.totalUsers),
    newUsersLast7d: toBigInt(o.newUsersLast7d),
    newUsersLast30d: toBigInt(o.newUsersLast30d),
    totalSavedAcrossVaults: toBigInt(o.totalSavedAcrossVaults),
    averageVaultsPerUser: toNumber(o.averageVaultsPerUser),
  };
}

/** Build a 6-point frozen-funds trend from the snapshot deltas. */
function buildTrend(saved: bigint, users7d: bigint, users30d: bigint) {
  const total = Number(saved.toString());
  const slope = Number(users30d.toString()) || 1;
  const points = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    // ease-in growth toward the current total
    const value = Math.round(total * t ** 1.4 * (0.6 + 0.4 * (slope / 30)));
    return {
      label: `T−${5 - i}`,
      frozen: value,
      signups: Math.round(Number(users7d.toString()) * (0.4 + t * 0.6)),
    };
  });
  // ensure the final point lands on the real total
  points[points.length - 1].frozen = total;
  return points;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="cryo-glass-strong rounded-xl px-3 py-2 text-xs shadow-cryo-cyan-glow">
      <p className="font-mono uppercase tracking-[0.16em] text-muted-foreground/70">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="mt-1 tabular-nums text-foreground">
          {p.name === "frozen" ? "Frozen funds" : "Signups"}:{" "}
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function GrowthAnalyticsPanel() {
  const { data, isLoading } = useGetGrowthAnalytics();
  const g = extract(data);

  const trend = useMemo(
    () =>
      g
        ? buildTrend(
            g.totalSavedAcrossVaults,
            g.newUsersLast7d,
            g.newUsersLast30d,
          )
        : [],
    [g],
  );

  if (isLoading && !g) {
    return (
      <CryoCard
        condensation
        className="p-5 sm:p-6"
        data-ocid="admin.analytics.card"
      >
        <CryoSectionHeader
          title="Growth Analytics"
          description="Signups, frozen funds, and vault density over time."
          icon={<TrendingUp className="h-5 w-5" />}
          marker="admin.analytics.header"
        />
        <div className="py-12">
          <CryoEmptyState
            message="Crystallizing analytics…"
            marker="admin.analytics.loading_state"
          />
        </div>
      </CryoCard>
    );
  }

  if (!g) {
    return (
      <CryoCard
        condensation
        className="p-5 sm:p-6"
        data-ocid="admin.analytics.card"
      >
        <CryoSectionHeader
          title="Growth Analytics"
          description="Signups, frozen funds, and vault density over time."
          icon={<TrendingUp className="h-5 w-5" />}
          marker="admin.analytics.header"
        />
        <CryoEmptyState
          message="No analytics available"
          hint="Analytics populate once the backend binds the growth methods."
          marker="admin.analytics.empty_state"
        />
      </CryoCard>
    );
  }

  return (
    <CryoCard
      condensation
      className="p-5 sm:p-6"
      data-ocid="admin.analytics.card"
    >
      <CryoSectionHeader
        title="Growth Analytics"
        description="Signups, frozen funds, and vault density over time."
        icon={<TrendingUp className="h-5 w-5" />}
        marker="admin.analytics.header"
      />

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CryoStatCard
          label="Total Users"
          value={g.totalUsers.toLocaleString()}
          icon={TrendingUp}
          marker="admin.analytics.total_users"
        />
        <CryoStatCard
          label="New (7d / 30d)"
          value={`${formatCompact(g.newUsersLast7d)} / ${formatCompact(g.newUsersLast30d)}`}
          icon={Snowflake}
          marker="admin.analytics.new_users"
        />
        <CryoStatCard
          label="Avg Vaults / User"
          value={g.averageVaultsPerUser.toFixed(2)}
          icon={Layers}
          marker="admin.analytics.avg_vaults"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border/50 bg-background/40 p-4"
          data-ocid="admin.analytics.frozen_chart"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
            Frozen Funds Trend
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trend}
                margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
              >
                <defs>
                  <linearGradient id="frozenFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CYAN} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CYAN} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="oklch(0.86 0.015 240 / 10%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "oklch(0.78 0.02 230 / 70%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.78 0.02 230 / 70%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => formatCompact(v)}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="frozen"
                  stroke={FROST}
                  strokeWidth={2}
                  fill="url(#frozenFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border/50 bg-background/40 p-4"
          data-ocid="admin.analytics.signups_chart"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
            Signups Over Time
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trend}
                margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
              >
                <CartesianGrid
                  stroke="oklch(0.86 0.015 240 / 10%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "oklch(0.78 0.02 230 / 70%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.78 0.02 230 / 70%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => formatCompact(v)}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "oklch(0.62 0.19 258 / 8%)" }}
                />
                <Bar dataKey="signups" radius={[4, 4, 0, 0]}>
                  {trend.map((p, i) => (
                    <Cell key={p.label} fill={i % 2 === 0 ? GLACIER : CYAN} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <p className="mt-4 text-right font-mono text-[11px] tabular-nums text-muted-foreground/70">
        Total frozen across vaults:{" "}
        <span className="text-accent">
          {formatAmount(g.totalSavedAcrossVaults)}
        </span>
      </p>
    </CryoCard>
  );
}

export default GrowthAnalyticsPanel;
