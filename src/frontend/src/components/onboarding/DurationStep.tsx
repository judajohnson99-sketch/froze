import { CryoButton, CryoCard, CryoInput } from "@/components/cryo";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { type ChangeEvent, useState } from "react";

/**
 * DurationStep — Step 4 of 5. Choose a lock duration for the vault.
 * Preset options render as selectable CryoCards; "Custom date" reveals
 * a date picker. Each option shows how long the money stays frozen.
 *
 * Durations are converted to nanoseconds by the parent via
 * `durationToNanos`. This component emits a `DurationSelection` that
 * the parent resolves.
 */
export type DurationPresetId =
  | "1m"
  | "3m"
  | "6m"
  | "1y"
  | "2y"
  | "5y"
  | "custom";

export interface DurationSelection {
  preset: DurationPresetId;
  /** ISO date string (yyyy-mm-dd) when preset === "custom". */
  customDate: string | null;
}

export interface DurationOption {
  id: DurationPresetId;
  label: string;
  durationLabel: string;
  icon: LucideIcon;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { id: "1m", label: "1 Month", durationLabel: "30 days on ice", icon: Lock },
  { id: "3m", label: "3 Months", durationLabel: "90 days on ice", icon: Lock },
  { id: "6m", label: "6 Months", durationLabel: "180 days on ice", icon: Lock },
  { id: "1y", label: "1 Year", durationLabel: "365 days on ice", icon: Lock },
  { id: "2y", label: "2 Years", durationLabel: "730 days on ice", icon: Lock },
  { id: "5y", label: "5 Years", durationLabel: "1825 days on ice", icon: Lock },
  {
    id: "custom",
    label: "Custom Date",
    durationLabel: "Pick a thaw date",
    icon: CalendarClock,
  },
];

export interface DurationStepProps {
  value: DurationSelection | null;
  onChange: (selection: DurationSelection) => void;
  onContinue: () => void;
  onBack: () => void;
}

function todayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1); // earliest = tomorrow
  return d.toISOString().split("T")[0] ?? "";
}

export function DurationStep({
  value,
  onChange,
  onContinue,
  onBack,
}: DurationStepProps) {
  const [customDraft, setCustomDraft] = useState<string>(
    value?.customDate ?? "",
  );

  const selectPreset = (id: DurationPresetId) => {
    if (id === "custom") {
      onChange({ preset: "custom", customDate: customDraft || null });
    } else {
      onChange({ preset: id, customDate: null });
    }
  };

  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setCustomDraft(v);
    if (value?.preset === "custom") {
      onChange({ preset: "custom", customDate: v || null });
    }
  };

  const isCustom = value?.preset === "custom";
  const canContinue =
    !!value &&
    (value.preset !== "custom" ||
      (!!value.customDate && value.customDate >= todayISO()));

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80">
          Choose your freeze
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How long should it stay frozen?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The longer the freeze, the harder it is to crack the vault open early.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DURATION_OPTIONS.map((opt, i) => {
          const selected = value?.preset === opt.id;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => selectPreset(opt.id)}
              data-ocid={`onboarding.duration.option.${opt.id}`}
              aria-pressed={selected}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
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
                <div className="relative z-10 flex items-start gap-3">
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-300",
                      selected
                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_18px_oklch(0.93_0.11_200/40%)]"
                        : "bg-muted/40 text-accent",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold text-foreground">
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {opt.durationLabel}
                    </p>
                  </div>
                </div>
              </CryoCard>
            </motion.button>
          );
        })}
      </div>

      {/* Custom date picker */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isCustom ? 1 : 0,
          height: isCustom ? "auto" : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        {isCustom ? (
          <div className="mt-6 cryo-glass rounded-2xl p-5">
            <label
              htmlFor="custom-date"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              Thaw date
            </label>
            <CryoInput
              id="custom-date"
              type="date"
              min={todayISO()}
              value={customDraft}
              onChange={handleDate}
              data-ocid="onboarding.duration.custom_date_input"
              className="mt-2 font-mono text-sm [color-scheme:dark]"
            />
            {customDraft && customDraft < todayISO() ? (
              <p
                className="mt-2 text-xs text-destructive"
                data-ocid="onboarding.duration.custom_date_error"
              >
                Pick a date in the future.
              </p>
            ) : null}
          </div>
        ) : null}
      </motion.div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <CryoButton
          variant="ghost"
          size="md"
          onClick={onBack}
          data-ocid="onboarding.duration.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </CryoButton>
        <CryoButton
          variant="primary"
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
          data-ocid="onboarding.duration.continue_button"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </CryoButton>
      </div>
    </div>
  );
}

export default DurationStep;
