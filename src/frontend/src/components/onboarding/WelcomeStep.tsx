import { CryoButton } from "@/components/cryo";
import { ArrowRight, Snowflake } from "lucide-react";
import { motion } from "motion/react";

/**
 * WelcomeStep — ceremonial welcome screen (Step 1 of 5).
 * Dark cryo hero with frost visuals, a brief explanation of Froze, and
 * a "Get Started" CryoButton to advance.
 */
export interface WelcomeStepProps {
  onContinue: () => void;
}

const FROST_PILLARS = [
  {
    title: "Lock savings on ice",
    body: "Move money into a frozen vault. It stays locked until your goal matures.",
  },
  {
    title: "Friction by design",
    body: "Impulse spending melts away when your funds are sealed behind cryo glass.",
  },
  {
    title: "Thaw on your terms",
    body: "Pick a freeze schedule. The vault unlocks the moment your timeline ends.",
  },
];

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      {/* Floating snowflake emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 -z-10 animate-frozen-glow-pulse rounded-full blur-2xl" />
        <span className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-accent/40 shadow-[0_0_48px_oklch(0.93_0.11_200/30%)]">
          <Snowflake className="h-12 w-12 text-accent animate-frozen-glow-pulse" />
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80"
      >
        Froze · Cryogenic Savings
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 font-display text-4xl font-semibold tracking-tight text-gradient-frost sm:text-5xl lg:text-6xl"
      >
        Begin Your Cryogenic Journey
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        Froze locks your savings inside a frozen vault, creating deliberate
        friction against impulse spending. Set a goal, choose a freeze schedule,
        and watch your money crystallize into something lasting.
      </motion.p>

      {/* Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.8 }}
        className="mt-10 grid w-full gap-4 sm:grid-cols-3"
      >
        {FROST_PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + i * 0.1, duration: 0.6 }}
            className="cryo-glass cryo-ice-facet rounded-2xl p-5 text-left"
          >
            <p className="font-display text-sm font-semibold text-foreground">
              {p.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {p.body}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="mt-10"
      >
        <CryoButton
          variant="primary"
          size="lg"
          onClick={onContinue}
          data-ocid="onboarding.welcome.continue_button"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </CryoButton>
      </motion.div>
    </div>
  );
}

export default WelcomeStep;
