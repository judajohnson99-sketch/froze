/**
 * HowItWorksSection — interactive 3-step timeline.
 *
 * Steps: Freeze Your Funds (crystallize), Keep It Locked
 * (ice-grows-outward), Watch It Thaw (subtle-melting). Each step is a
 * CryoCard with an animated visual and description. motion `useInView`
 * activates the animation when the card scrolls into view.
 */
import { CryoCard } from "@/components/cryo";
import { Droplets, Lock, Snowflake } from "lucide-react";
import { motion, useInView } from "motion/react";
import { type ReactNode, useRef } from "react";

interface Step {
  index: number;
  title: string;
  description: string;
  icon: ReactNode;
  animationClass: string;
  visual: ReactNode;
}

const STEPS: Step[] = [
  {
    index: 1,
    title: "Freeze Your Funds",
    description:
      "Move money into a cryo vault and watch it crystallize. Once frozen, the funds are locked beyond impulse.",
    icon: <Snowflake className="h-6 w-6 text-accent" />,
    animationClass: "animate-crystallize",
    visual: <CrystallizeVisual />,
  },
  {
    index: 2,
    title: "Keep It Locked",
    description:
      "Choose a lock duration — weeks, months, or years. Ice grows outward, reinforcing your resolve the whole way.",
    icon: <Lock className="h-6 w-6 text-accent" />,
    animationClass: "animate-ice-grows-outward",
    visual: <IceGrowsVisual />,
  },
  {
    index: 3,
    title: "Watch It Thaw",
    description:
      "When the lock ends, your savings thaw back to liquid. Discipline rewarded, goals realized.",
    icon: <Droplets className="h-6 w-6 text-accent" />,
    animationClass: "animate-subtle-melting",
    visual: <MeltingVisual />,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8"
    >
      <SectionHeading />
      <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <StepCard key={step.index} step={step} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
        The Process
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gradient-frost sm:text-5xl">
        How Froze Works
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Three phases. One discipline. Your savings move from liquid to frozen
        and back — on your terms.
      </p>
    </motion.div>
  );
}

function StepCard({ step, delay }: { step: Step; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <CryoCard
        condensation
        facet
        glow
        className="group flex h-full flex-col p-8 transition-transform duration-500 hover:-translate-y-1"
        data-ocid={`how_it_works.step.${step.index}.card`}
      >
        {/* Step number + icon */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            0{step.index}
          </span>
          <span className="grid h-12 w-12 place-items-center rounded-2xl cryo-glass-strong">
            {step.icon}
          </span>
        </div>

        {/* Animated visual */}
        <div className="my-8 grid h-32 place-items-center">{step.visual}</div>

        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </CryoCard>
    </motion.div>
  );
}

/* ── Step visuals ── */

/** Step 1 — crystallize: a snowflake that crystallizes on view. */
function CrystallizeVisual() {
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.93 0.11 200 / 22%) 0%, transparent 70%)",
        }}
      />
      <Snowflake
        className="animate-crystallize h-16 w-16 text-accent"
        style={{ filter: "drop-shadow(0 0 12px oklch(0.93 0.11 200 / 50%))" }}
      />
    </div>
  );
}

/** Step 2 — ice grows outward: expanding ring pulses. */
function IceGrowsVisual() {
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <Lock className="h-10 w-10 text-accent" />
      <span
        aria-hidden
        className="animate-ice-grows-outward absolute h-16 w-16 rounded-full border-2 border-accent/50"
      />
      <span
        aria-hidden
        className="animate-ice-grows-outward absolute h-16 w-16 rounded-full border-2 border-accent/40"
        style={{ animationDelay: "0.7s" }}
      />
    </div>
  );
}

/** Step 3 — subtle melting: a droplet that gently melts. */
function MeltingVisual() {
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.19 258 / 18%) 0%, transparent 70%)",
        }}
      />
      <Droplets
        className="animate-subtle-melting h-14 w-14 text-accent"
        style={{ filter: "drop-shadow(0 0 10px oklch(0.94 0.1 200 / 45%))" }}
      />
    </div>
  );
}

export default HowItWorksSection;
