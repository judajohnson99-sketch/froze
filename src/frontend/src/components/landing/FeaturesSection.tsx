/**
 * FeaturesSection — the "Why Froze works when willpower doesn't" section.
 *
 * Rebuilt around the new Froze copy structure:
 *   1. Opening hero statement (large heading + subtitle + Froze-frost line)
 *   2. Feature group 1 — "Lock money in ways no bank account ever does" (3 cards)
 *   3. Feature group 2 — "Built for real-life impulses, not perfect discipline" (3 cards)
 *   4. Feature group 3 — "Accountability that actually feels real (optional)" (4 consequence rows)
 *   5. Closing block — "Commitment, not restriction."
 *   6. Final CTA block — "Start freezing. Start building." + FROZE wordmark
 *
 * Visual theme is preserved: dark steel + diamond-plate base, frosted glass
 * cards via `CryoCard` with `condensation` + `facet`, `cryo-floating-shadow`,
 * `cryo-glint`, and `hover:cryo-edge-glow`. Entrance animations use
 * `motion/react` with the existing fade-up-in pattern and staggered delays.
 */
import { CryoCard } from "@/components/cryo";
import {
  Activity,
  Bell,
  CalendarClock,
  Flame,
  Gauge,
  Heart,
  Lock,
  Percent,
  Repeat,
  Snowflake,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * Shared motion config — matches the existing fade-up-in pattern.
 * ────────────────────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Data — feature groups and consequence items.
 * ────────────────────────────────────────────────────────────────────────── */
interface FeatureItem {
  index: number;
  icon: ReactNode;
  title: string;
  description: string;
}

const LOCK_FEATURES: FeatureItem[] = [
  {
    index: 1,
    icon: <Timer className="h-7 w-7 text-accent" />,
    title: "Time-Locked Vaults",
    description:
      "Freeze funds for days, months, or years. Set the thaw date once and the money stays out of reach until the clock runs out — no late-night withdrawals, no second-guessing.",
  },
  {
    index: 2,
    icon: <Target className="h-7 w-7 text-accent" />,
    title: "Goal-Locked Savings",
    description:
      "Money stays frozen until you hit your target — like $5,000. The vault won't thaw until the balance crosses the line you set, so the goal decides, not the moment.",
  },
  {
    index: 3,
    icon: <Repeat className="h-7 w-7 text-accent" />,
    title: "Auto-Freeze Roundups",
    description:
      "Every purchase quietly builds locked savings in the background. Spare change rounds up and freezes automatically — you save without ever having to think about it.",
  },
];

const IMPULSE_FEATURES: FeatureItem[] = [
  {
    index: 1,
    icon: <Zap className="h-7 w-7 text-accent" />,
    title: "Impulse Freeze Detection",
    description:
      "Subtle check-ins when your spending patterns spike. A quiet pause before the money moves — not a block, just a moment to decide on purpose.",
  },
  {
    index: 2,
    icon: <Gauge className="h-7 w-7 text-accent" />,
    title: "Freeze Score",
    description:
      "Track your financial discipline over time. Your Freeze Score rises as you keep promises to yourself and dips when you break them — a clear, honest mirror.",
  },
  {
    index: 3,
    icon: <Activity className="h-7 w-7 text-accent" />,
    title: "Freeze Identity",
    description:
      "Watch your status evolve from Liquid → Deep Freeze → Permafrost. Each tier marks a real streak of discipline, earned one kept vault at a time.",
  },
];

interface ConsequenceItem {
  index: number;
  icon: ReactNode;
  title: string;
  description: string;
  optional?: boolean;
}

const CONSEQUENCES: ConsequenceItem[] = [
  {
    index: 1,
    icon: <Percent className="h-6 w-6 text-accent" />,
    title: "Pay a small % fee",
    description:
      "A modest percentage of the broken vault goes back into your locked savings — a gentle cost, not a punishment.",
  },
  {
    index: 2,
    icon: <Users className="h-6 w-6 text-accent" />,
    title: "Notify your chosen circle",
    description:
      "Friends, family, or your support network get a quiet heads-up that a vault was broken early.",
    optional: true,
  },
  {
    index: 3,
    icon: <Heart className="h-6 w-6 text-accent" />,
    title: "Donate % to your chosen charity",
    description:
      "Send a slice of the broken vault to a cause you care about — turn the slip into something good.",
    optional: true,
  },
  {
    index: 4,
    icon: <Flame className="h-6 w-6 text-accent" />,
    title: "Trigger a Thaw Event",
    description:
      "Marks the moment on your savings timeline — a visible notch in your discipline history you can learn from.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Section root
 * ────────────────────────────────────────────────────────────────────────── */
export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-8 overflow-hidden py-16 sm:py-24"
    >
      {/* Ambient backlight — keeps the dark-steel cryo glow under the section */}
      <div className="cryo-mesh-backlight" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <OpeningBlock />

        <FeatureGroup
          eyebrow="Group 01 · Locks"
          heading="Lock money in ways no bank account ever does"
          headingIcon={<Lock className="h-5 w-5 text-accent" />}
          items={LOCK_FEATURES}
          startDelay={0.1}
        />

        <FeatureGroup
          eyebrow="Group 02 · Impulses"
          heading="Built for real-life impulses, not perfect discipline"
          headingIcon={<Zap className="h-5 w-5 text-accent" />}
          items={IMPULSE_FEATURES}
          startDelay={0.1}
        />

        <AccountabilityBlock />

        <ClosingBlock />

        <FinalCTA />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Opening block — hero statement + subtitle + Froze-frost line.
 * ────────────────────────────────────────────────────────────────────────── */
function OpeningBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
        Why Froze works
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-gradient-frost sm:text-4xl lg:text-5xl">
        Put your money out of reach — until your future self is ready for it.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
        A savings system built to stop impulse decisions before they start.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
        Most apps help you track your money.{" "}
        <span className="font-display font-semibold text-gradient-frost">
          Froze
        </span>{" "}
        helps you control access to it.
      </p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Feature group — header + 3-card grid. Reused for groups 1 and 2.
 * ────────────────────────────────────────────────────────────────────────── */
interface FeatureGroupProps {
  eyebrow: string;
  heading: string;
  headingIcon: ReactNode;
  items: FeatureItem[];
  startDelay: number;
}

function FeatureGroup({
  eyebrow,
  heading,
  headingIcon,
  items,
  startDelay,
}: FeatureGroupProps) {
  return (
    <div className="mt-16 sm:mt-24">
      <FadeUp>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl cryo-glass-strong">
            {headingIcon}
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
              {eyebrow}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {heading}
            </h3>
          </div>
        </div>
      </FadeUp>

      <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((feature, i) => (
          <FeatureCard
            key={`${eyebrow}-${feature.index}`}
            feature={feature}
            delay={startDelay + i * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  feature,
  delay,
}: { feature: FeatureItem; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <CryoCard
        condensation
        facet
        className="cryo-floating-shadow cryo-glint group relative flex h-full flex-col p-6 transition-all duration-500 hover:-translate-y-1 hover:cryo-edge-glow sm:p-7"
        data-ocid={`features.item.${feature.index}.card`}
      >
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl cryo-glass-strong transition-transform duration-500 group-hover:scale-110">
              {feature.icon}
            </span>
            <span className="cryo-badge-pill !px-3 !py-1.5 !text-[10px]">
              {`0${feature.index}`}
            </span>
          </div>

          <h4 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {feature.title}
          </h4>

          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-[15px] sm:leading-relaxed">
            {feature.description}
          </p>
        </div>
      </CryoCard>
    </FadeUp>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Accountability block — group 3 with intro line + 4 consequence rows.
 * ────────────────────────────────────────────────────────────────────────── */
function AccountabilityBlock() {
  return (
    <div className="mt-16 sm:mt-24">
      <FadeUp>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl cryo-glass-strong">
            <Snowflake className="h-5 w-5 text-accent" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
              Group 03 · Accountability
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Accountability that actually feels real{" "}
              <span className="text-foreground/60">(optional)</span>
            </h3>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
          Break a vault early and you choose what happens:
        </p>
      </FadeUp>

      <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-2">
        {CONSEQUENCES.map((item, i) => (
          <ConsequenceRow
            key={`consequence-${item.index}`}
            item={item}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>
    </div>
  );
}

function ConsequenceRow({
  item,
  delay,
}: { item: ConsequenceItem; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <CryoCard
        condensation
        facet
        className="cryo-glint group relative flex h-full items-start gap-4 p-5 transition-all duration-500 hover:-translate-y-0.5 hover:cryo-edge-glow sm:p-6"
        data-ocid={`features.consequence.${item.index}.card`}
      >
        <div className="relative z-10 flex w-full items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl cryo-glass-strong transition-transform duration-500 group-hover:scale-110">
            {item.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {item.title}
              </h4>
              {item.optional && (
                <span className="cryo-badge-pill !px-2 !py-0.5 !text-[9px]">
                  Optional
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
              {item.description}
            </p>
          </div>
        </div>
      </CryoCard>
    </FadeUp>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Closing block — "Commitment, not restriction."
 * ────────────────────────────────────────────────────────────────────────── */
function ClosingBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mx-auto mt-20 max-w-3xl text-center sm:mt-28"
    >
      <CryoCard
        strong
        condensation
        facet
        className="cryo-floating-shadow cryo-glint relative overflow-hidden p-8 sm:p-12"
        data-ocid="features.closing.card"
      >
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl cryo-glass-strong">
            <Lock className="h-7 w-7 text-accent" />
          </span>
          <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight text-gradient-frost sm:text-4xl lg:text-5xl">
            Commitment, not restriction.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            Froze never blocks you from your money. It just makes you think
            twice before breaking a promise to yourself.
          </p>
        </div>
      </CryoCard>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Final CTA — "Start freezing. Start building." + FROZE wordmark line.
 * ────────────────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className="mx-auto mt-12 max-w-3xl text-center sm:mt-16"
    >
      <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Start freezing. Start building.
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
        <span className="font-display text-lg font-semibold tracking-[0.18em] text-gradient-frost sm:text-xl">
          FROZE
        </span>{" "}
        — where discipline becomes the set in ice.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-accent/70">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
          Freeze · Build · Thaw on your terms
        </span>
        <Bell className="h-4 w-4" aria-hidden="true" />
      </div>
    </motion.div>
  );
}

export default FeaturesSection;
