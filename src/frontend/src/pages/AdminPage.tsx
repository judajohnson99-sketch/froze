import { GrowthAnalyticsPanel as GrowthAnalytics } from "@/components/admin/GrowthAnalytics";
import { JobSystemMonitor } from "@/components/admin/JobSystemMonitor";
import { MetricsOverview } from "@/components/admin/MetricsOverview";
import { VaultStatistics } from "@/components/admin/VaultStatistics";
import { WaitlistManagement } from "@/components/admin/WaitlistManagement";
import { CryoTabBar, type CryoTabItem } from "@/components/cryo/CryoTabBar";
/**
 * AdminPage — Cryo Control Room. Aurora-glow header, CryoTabBar with
 * five sections (Overview / Waitlist / Analytics / Vaults / Jobs), and
 * the five section components composed together. Mobile-first
 * responsive: tabs scroll horizontally on narrow viewports.
 */
import { Cog, Gauge, Mail, TrendingUp, Vault as VaultIcon } from "lucide-react";
import { motion } from "motion/react";

const TABS: CryoTabItem[] = [
  { value: "overview", label: "Overview", marker: "admin.tab.overview" },
  { value: "waitlist", label: "Waitlist", marker: "admin.tab.waitlist" },
  { value: "analytics", label: "Analytics", marker: "admin.tab.analytics" },
  { value: "vaults", label: "Vaults", marker: "admin.tab.vaults" },
  { value: "jobs", label: "Jobs", marker: "admin.tab.jobs" },
];

const TAB_ICONS: Record<string, typeof Gauge> = {
  overview: Gauge,
  waitlist: Mail,
  analytics: TrendingUp,
  vaults: VaultIcon,
  jobs: Cog,
};

export function AdminPage() {
  return (
    <div className="relative min-h-screen pb-16" data-ocid="admin.page">
      {/* Aurora glow band behind the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 overflow-hidden"
      >
        <div className="cryo-aurora animate-aurora-glow absolute left-1/2 top-0 h-40 w-[120%] -translate-x-1/2" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-3"
          data-ocid="admin.header"
        >
          <span className="inline-flex items-center gap-2 self-start rounded-pill border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent shadow-cryo-cyan-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-frozen-glow-pulse" />
            Admin Only
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-gradient-frost sm:text-4xl lg:text-5xl">
            Cryo Control Room
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Operations console for the frozen vault — job system health,
            dead-letter queue, growth analytics, and every vault in the chamber.
          </p>
        </motion.header>

        {/* Tabs + content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <CryoTabBar
            defaultValue="overview"
            items={TABS}
            className="[&>[role=tablist]]:overflow-x-auto [&>[role=tablist]]:flex-wrap sm:[&>[role=tablist]]:flex-nowrap"
          >
            {TABS.map((tab) => {
              const Icon = TAB_ICONS[tab.value];
              return (
                <section
                  key={tab.value}
                  data-ocid={`admin.panel.${tab.value}`}
                  className="mt-6 focus-visible:outline-none"
                >
                  <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                      {tab.label}
                    </span>
                  </div>
                  {tab.value === "overview" ? <MetricsOverview /> : null}
                  {tab.value === "waitlist" ? <WaitlistManagement /> : null}
                  {tab.value === "analytics" ? <GrowthAnalytics /> : null}
                  {tab.value === "vaults" ? <VaultStatistics /> : null}
                  {tab.value === "jobs" ? <JobSystemMonitor /> : null}
                </section>
              );
            })}
          </CryoTabBar>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminPage;
