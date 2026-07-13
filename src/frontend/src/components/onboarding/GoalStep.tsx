import { CryoButton, CryoCard } from "@/components/cryo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Car,
  HeartPulse,
  Home,
  type LucideIcon,
  Plane,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * GoalStep — Step 2 of 5. Present savings goals as selectable CryoCards.
 * Each card has an icon + label; the selected card gets a cyan glow.
 * "Continue" is disabled until a selection is made.
 */
export type SavingsGoal =
  | "emergency_fund"
  | "vacation"
  | "new_car"
  | "new_home"
  | "custom";

export interface GoalOption {
  id: SavingsGoal;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "emergency_fund",
    label: "Emergency Fund",
    description: "A safety net sealed in ice for life's surprises.",
    icon: HeartPulse,
  },
  {
    id: "vacation",
    label: "Vacation",
    description: "Freeze funds until your getaway thaws.",
    icon: Plane,
  },
  {
    id: "new_car",
    label: "New Car",
    description: "Cruise toward your next set of wheels.",
    icon: Car,
  },
  {
    id: "new_home",
    label: "New Home",
    description: "Build the foundation for your future.",
    icon: Home,
  },
  {
    id: "custom",
    label: "Custom Goal",
    description: "Define your own cryogenic milestone.",
    icon: Sparkles,
  },
];

export interface GoalStepProps {
  value: SavingsGoal | null;
  onChange: (goal: SavingsGoal) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function GoalStep({
  value,
  onChange,
  onContinue,
  onBack,
}: GoalStepProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80">
          Choose your goal
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What are you freezing for?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Pick a savings goal. Your vault will be shaped around it.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GOAL_OPTIONS.map((opt, i) => {
          const selected = value === opt.id;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              data-ocid={`onboarding.goal.option.${opt.id}`}
              aria-pressed={selected}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="text-left"
            >
              <CryoCard
                condensation
                facet
                className={cn(
                  "h-full cursor-pointer p-5 transition-all duration-300",
                  selected
                    ? "cryo-edge-glow ring-2 ring-accent/60 bg-accent/10"
                    : "hover:ring-1 hover:ring-accent/30",
                )}
              >
                <div className="relative z-10 flex flex-col gap-3">
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-xl transition-all duration-300",
                      selected
                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_20px_oklch(0.93_0.11_200/40%)]"
                        : "bg-muted/40 text-accent",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">
                      {opt.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </div>
              </CryoCard>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <CryoButton
          variant="ghost"
          size="md"
          onClick={onBack}
          data-ocid="onboarding.goal.back_button"
        >
          Back
        </CryoButton>
        <CryoButton
          variant="primary"
          size="lg"
          onClick={onContinue}
          disabled={!value}
          data-ocid="onboarding.goal.continue_button"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </CryoButton>
      </div>
    </div>
  );
}

export default GoalStep;
