import { AmountStep } from "@/components/onboarding/AmountStep";
import { CreateVaultStep } from "@/components/onboarding/CreateVaultStep";
import {
  type DurationSelection,
  DurationStep,
} from "@/components/onboarding/DurationStep";
import { GoalStep, type SavingsGoal } from "@/components/onboarding/GoalStep";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/**
 * OnboardingPage — 5-screen guided cold-start for Froze.
 *
 * A local state machine tracks the current step (1-5) and the collected
 * data (goal, targetAmount, lockDurationNs). Durations are converted to
 * nanoseconds for the backend. Steps transition with motion AnimatePresence
 * and a back affordance is available on every step after the first.
 */

const STEP_LABELS = ["Welcome", "Goal", "Amount", "Duration", "Create"];

const NS_PER_DAY = 24n * 60n * 60n * 1_000_000_000n;
const DAYS_BY_PRESET: Record<
  Exclude<DurationSelection["preset"], "custom">,
  bigint
> = {
  "1m": 30n,
  "3m": 90n,
  "6m": 180n,
  "1y": 365n,
  "2y": 730n,
  "5y": 1825n,
};

/** Convert a duration selection into nanoseconds from now. */
function durationToNanos(selection: DurationSelection): bigint {
  if (selection.preset === "custom") {
    if (!selection.customDate) return 0n;
    const target = new Date(selection.customDate).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, target - now);
    // ms → ns
    return BigInt(Math.ceil(diffMs)) * 1_000_000n;
  }
  return DAYS_BY_PRESET[selection.preset] * NS_PER_DAY;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [duration, setDuration] = useState<DurationSelection | null>(null);

  const lockDurationNs = duration ? durationToNanos(duration) : 0n;

  const goNext = () => setStep((s) => (s < 5 ? ((s + 1) as Step) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  const goToStep = (target: number) => {
    if (target >= 1 && target <= step) setStep(target as Step);
  };

  // Direction-aware slide for AnimatePresence.
  const direction = step >= 1 ? 1 : -1;

  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      {/* Ambient aurora band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 cryo-aurora animate-aurora-glow"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Progress indicator */}
        <div className="mb-10 sm:mb-14">
          <StepProgress
            current={step}
            total={5}
            labels={STEP_LABELS}
            onStepClick={goToStep}
          />
        </div>

        {/* Step content with animated transitions */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 1 ? <WelcomeStep onContinue={goNext} /> : null}

            {step === 2 ? (
              <GoalStep
                value={goal}
                onChange={setGoal}
                onContinue={goNext}
                onBack={goBack}
              />
            ) : null}

            {step === 3 ? (
              <AmountStep
                value={targetAmount}
                onChange={setTargetAmount}
                onContinue={goNext}
                onBack={goBack}
              />
            ) : null}

            {step === 4 ? (
              <DurationStep
                value={duration}
                onChange={setDuration}
                onContinue={goNext}
                onBack={goBack}
              />
            ) : null}

            {step === 5 && goal && targetAmount && duration ? (
              <CreateVaultStep
                goal={goal}
                targetAmount={targetAmount}
                duration={duration}
                lockDurationNs={lockDurationNs}
                onBack={goBack}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OnboardingPage;
