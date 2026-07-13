import {
  Bell,
  Lock,
  Plus,
  Snowflake,
  Sparkles,
  TrendingUp,
} from "lucide-react";
/**
 * ProductPreview — a polished, on-brand mockup of the finished Froze vault
 * dashboard, rendered entirely with HTML/CSS/SVG (no flat image).
 *
 * The mockup sits inside a frosted-glass browser/device frame
 * (cryo-glass-strong + cryo-edge-glow + cryo-ice-facet) and contains a
 * stylized but realistic app dashboard preview:
 *
 *   1. Vault balance card — Snowflake icon, "Frozen" badge, countdown timer
 *      ("Unlocks in 42 days").
 *   2. Savings goal — "Emergency Fund — 68% to goal" with a progress bar.
 *   3. Deposit action button — cryo-glass-button styled.
 *   4. Insights/notifications strip — small frosted tiles with lucide icons.
 *
 * A clear "A preview of what's coming" label sits on the frame so users
 * understand the experience is not yet live. The section heading is
 * empathetic and hype-building.
 *
 * Strict 8px/16px spacing framework. Fully responsive: the frame scales
 * gracefully and stacks on mobile.
 */
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductPreview() {
  return (
    <section
      id="preview"
      className="relative scroll-mt-8 overflow-hidden bg-background py-24"
    >
      {/* Ambient aurora band behind the frame */}
      <div
        aria-hidden
        className="cryo-aurora animate-aurora-glow pointer-events-none absolute top-1/2 left-1/2 h-64 w-[80%] max-w-4xl -translate-x-1/2 -translate-y-1/2 opacity-30"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading />
        <PreviewFrame />
      </div>
    </section>
  );
}

/* ── Section heading ─────────────────────────────────────────────────── */

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
        A preview of what's coming
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gradient-frost sm:text-5xl">
        Your savings, frozen in time — until you're ready
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        A glimpse of the calm, focused vault you'll wake up to. Every number
        here is illustrative — the real thing will be colder, calmer, and yours.
      </p>
    </motion.div>
  );
}

/* ── Browser / device frame ──────────────────────────────────────────── */

function PreviewFrame() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mt-16"
    >
      <div
        className="cryo-glass-strong cryo-edge-glow cryo-ice-facet cryo-floating-shadow relative rounded-3xl p-2 sm:p-3"
        data-ocid="preview.frame"
      >
        {/* Browser chrome — traffic dots + address pill */}
        <BrowserChrome />

        {/* Dashboard canvas */}
        <div className="relative mt-2 overflow-hidden rounded-2xl ring-1 ring-inset ring-border/40 sm:mt-3">
          <DashboardCanvas />
        </div>
      </div>

      {/* Caption beneath the frame */}
      <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80">
        Illustrative mockup · not yet live
      </p>
    </motion.div>
  );
}

function BrowserChrome() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.14_200/55%)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.6_0.14_210/45%)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.02_240/45%)]" />
      </div>
      <div className="cryo-glass mx-auto flex min-w-0 items-center gap-2 rounded-pill px-4 py-1.5">
        <Lock className="h-3 w-3 shrink-0 text-accent/70" />
        <span className="truncate font-mono text-[11px] tracking-wide text-muted-foreground">
          froze.app/vault
        </span>
      </div>
      <div className="hidden sm:block sm:w-12" aria-hidden />
    </div>
  );
}

/* ── Dashboard canvas (the actual app UI mockup) ──────────────────────── */

function DashboardCanvas() {
  return (
    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
      {/* App top bar */}
      <AppTopBar />

      {/* Main grid: vault card (left) + side rail (right) */}
      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
        <VaultBalanceCard />
        <SideRail />
      </div>

      {/* Goal + deposit row */}
      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[1fr_auto] lg:items-stretch lg:gap-6">
        <GoalCard />
        <DepositAction />
      </div>
    </div>
  );
}

function AppTopBar() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl cryo-glass-strong">
          <Snowflake className="h-5 w-5 text-accent" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-tight text-foreground">
            Froze
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Vault Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="cryo-glass inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5">
          <Bell className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            3
          </span>
        </span>
        <span
          className="grid h-9 w-9 place-items-center rounded-full cryo-glass-strong font-mono text-xs font-semibold text-gradient-frost"
          aria-hidden
        >
          JM
        </span>
      </div>
    </div>
  );
}

/* ── Vault balance card (frozen status + countdown) ──────────────────── */

function VaultBalanceCard() {
  return (
    <div
      className="cryo-glass cryo-condensation cryo-vault-tier-3 relative overflow-hidden rounded-2xl p-5 sm:p-6"
      data-ocid="preview.vault_balance.card"
    >
      {/* Aurora wash */}
      <div
        aria-hidden
        className="cryo-aurora animate-aurora-glow pointer-events-none absolute -top-10 left-0 right-0 h-20 opacity-40"
      />

      <div className="relative z-10">
        {/* Header: label + frozen badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Total Frozen Balance
            </p>
            <p className="mt-2 font-display text-4xl font-semibold tabular-nums text-gradient-frost sm:text-5xl">
              $4,820.00
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent ring-1 ring-inset ring-accent/30"
            data-ocid="preview.frozen_status.badge"
          >
            <Snowflake className="h-3.5 w-3.5" />
            Frozen
          </span>
        </div>

        {/* Mini sparkline (SVG) */}
        <Sparkline />

        {/* Countdown + lock status row */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="cryo-glass rounded-xl p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              <Lock className="h-3 w-3" />
              Unlocks in
            </p>
            <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
              42 days
            </p>
          </div>
          <div className="cryo-glass rounded-xl p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              <TrendingUp className="h-3 w-3" />
              This month
            </p>
            <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[oklch(0.55_0.15_175)]">
              +$240.00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lightweight inline SVG sparkline — pure decoration, no data binding. */
function Sparkline() {
  return (
    <div className="mt-5" aria-hidden>
      <svg
        viewBox="0 0 320 64"
        preserveAspectRatio="none"
        className="h-16 w-full"
        role="img"
        aria-label="Savings trend"
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.6 0.14 210 / 0.32)" />
            <stop offset="100%" stopColor="oklch(0.6 0.14 210 / 0)" />
          </linearGradient>
          <linearGradient id="spark-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.52 0.2 258)" />
            <stop offset="100%" stopColor="oklch(0.7 0.14 200)" />
          </linearGradient>
        </defs>
        <path
          d="M0 48 L40 44 L80 38 L120 40 L160 30 L200 26 L240 18 L280 14 L320 8 L320 64 L0 64 Z"
          fill="url(#spark-fill)"
        />
        <path
          d="M0 48 L40 44 L80 38 L120 40 L160 30 L200 26 L240 18 L280 14 L320 8"
          fill="none"
          stroke="url(#spark-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ── Side rail: insights / notifications strip ────────────────────────── */

function SideRail() {
  return (
    <div className="flex flex-col gap-3" data-ocid="preview.insights.list">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        Insights
      </p>
      <InsightTile
        index={1}
        icon={<TrendingUp className="h-4 w-4 text-[oklch(0.55_0.15_175)]" />}
        title="Streak preserved"
        body="32 days of mindful saving. The ice is thickening."
      />
      <InsightTile
        index={2}
        icon={<Snowflake className="h-4 w-4 text-accent" />}
        title="Auto-deposit landed"
        body="+$60 added to Emergency Fund while you slept."
      />
      <InsightTile
        index={3}
        icon={<Sparkles className="h-4 w-4 text-[oklch(0.82_0.14_85)]" />}
        title="Goal within reach"
        body="Vacation Vault is 88% funded. Two months to go."
      />
    </div>
  );
}

function InsightTile({
  index,
  icon,
  title,
  body,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      className="cryo-glass flex items-start gap-3 rounded-xl p-3"
      data-ocid={`preview.insights.item.${index}`}
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-background/60">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-medium text-foreground">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}

/* ── Goal card with progress bar ─────────────────────────────────────── */

function GoalCard() {
  return (
    <div
      className="cryo-glass cryo-condensation relative overflow-hidden rounded-2xl p-5 sm:p-6"
      data-ocid="preview.goal.card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Savings Goal
          </p>
          <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground">
            Emergency Fund
          </h3>
        </div>
        <span className="cryo-badge-pill !px-3 !py-1.5 !text-[10px]">
          68% to goal
        </span>
      </div>

      {/* Custom progress bar (SVG-free, pure CSS) */}
      <div className="mt-5">
        <div
          className="relative h-2.5 w-full overflow-hidden rounded-pill bg-muted/40 ring-1 ring-inset ring-border/40"
          role="progressbar"
          aria-valuenow={68}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          data-ocid="preview.goal.progress"
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-pill"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.52 0.2 258) 0%, oklch(0.7 0.14 200) 100%)",
              boxShadow:
                "0 0 12px oklch(0.7 0.14 200 / 45%), 0 0 24px oklch(0.52 0.2 258 / 25%)",
            }}
            initial={{ width: 0 }}
            whileInView={{ width: "68%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-xs tabular-nums text-muted-foreground">
          <span>$3,400 saved</span>
          <span>$5,000 goal</span>
        </div>
      </div>
    </div>
  );
}

/* ── Deposit action button ───────────────────────────────────────────── */

function DepositAction() {
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        className="cryo-glass-button cryo-glint cryo-btn-sweep flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-display text-base font-semibold sm:w-auto lg:px-8"
        data-ocid="preview.deposit.button"
      >
        <Plus className="h-5 w-5" />
        Add Deposit
      </button>
    </div>
  );
}

export default ProductPreview;
