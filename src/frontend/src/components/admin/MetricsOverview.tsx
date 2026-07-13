import type { AdminMetrics } from "@/backend";
import { CryoStatCard } from "@/components/cryo/CryoStatCard";
import { useGetMetrics } from "@/hooks/useBackend";
/**
 * MetricsOverview — row of CryoStatCards summarizing the six AdminMetrics
 * fields. Casts the `useGetMetrics` result (typed `unknown` until the
 * optional backend method binds) to `AdminMetrics` with defensive
 * narrowing so the grid renders zeros instead of crashing.
 */
import {
  AlertOctagon,
  Clock,
  Mail,
  Snowflake,
  Users,
  Vault,
} from "lucide-react";
import { motion } from "motion/react";
import { toBigInt } from "./cryoAdminHelpers";

interface MetricDef {
  key: keyof AdminMetrics;
  label: string;
  icon: typeof Users;
  marker: string;
}

const METRICS: MetricDef[] = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    marker: "admin.metrics.total_users",
  },
  {
    key: "totalVaults",
    label: "Total Vaults",
    icon: Vault,
    marker: "admin.metrics.total_vaults",
  },
  {
    key: "totalDeposits",
    label: "Total Deposits",
    icon: Snowflake,
    marker: "admin.metrics.total_deposits",
  },
  {
    key: "pendingJobs",
    label: "Pending Jobs",
    icon: Clock,
    marker: "admin.metrics.pending_jobs",
  },
  {
    key: "deadLetterJobs",
    label: "Dead Letter Jobs",
    icon: AlertOctagon,
    marker: "admin.metrics.dead_letter_jobs",
  },
  {
    key: "waitlistCount",
    label: "Waitlist Count",
    icon: Mail,
    marker: "admin.metrics.waitlist_count",
  },
];

function extractMetrics(data: unknown): AdminMetrics | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  return {
    totalUsers: toBigInt(o.totalUsers),
    totalVaults: toBigInt(o.totalVaults),
    totalDeposits: toBigInt(o.totalDeposits),
    pendingJobs: toBigInt(o.pendingJobs),
    deadLetterJobs: toBigInt(o.deadLetterJobs),
    waitlistCount: toBigInt(o.waitlistCount),
  };
}

export function MetricsOverview() {
  const { data, isLoading } = useGetMetrics();
  const metrics = extractMetrics(data);

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      data-ocid="admin.metrics.section"
    >
      {METRICS.map((m, i) => {
        const value = metrics ? metrics[m.key] : 0n;
        return (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <CryoStatCard
              label={m.label}
              value={isLoading ? "—" : value.toLocaleString()}
              icon={m.icon}
              marker={m.marker}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default MetricsOverview;
