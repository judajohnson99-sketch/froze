import { CryoButton } from "@/components/cryo";
import { Link } from "@tanstack/react-router";
import { Snowflake } from "lucide-react";
import { motion } from "motion/react";

/**
 * EmptyVaultsState — ceremonial empty state for the My Vaults page.
 *
 * Shown when the user has no vaults. A frosted-glass monument with a
 * pulsing snowflake, a headline, supporting copy, and a single
 * "Create Your First Vault" CTA linking to /onboarding.
 */
export interface EmptyVaultsStateProps {
  marker?: string;
}

export function EmptyVaultsState({
  marker = "vaults.empty_state",
}: EmptyVaultsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="cryo-glass-strong cryo-condensation relative mx-auto flex max-w-xl flex-col items-center gap-6 overflow-hidden rounded-2xl px-8 py-16 text-center"
      data-ocid={marker}
    >
      {/* Ambient aurora */}
      <div
        aria-hidden
        className="cryo-aurora animate-aurora-glow pointer-events-none absolute -top-16 left-0 right-0 h-32 opacity-50"
      />

      {/* Pulsing snowflake monument */}
      <div className="relative z-10">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-inset ring-accent/30">
          <Snowflake className="h-12 w-12 animate-frozen-glow-pulse text-accent" />
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        <h2 className="font-display text-2xl font-semibold text-gradient-frost">
          The vault is silent
        </h2>
        <p className="mx-auto max-w-sm font-body text-sm text-muted-foreground">
          No savings frozen yet. Forge your first block of ice — set a goal,
          lock a schedule, and watch the frost thicken as your money freezes
          into something permanent.
        </p>
      </div>

      <Link
        to="/onboarding"
        className="relative z-10"
        data-ocid={`${marker}.cta`}
      >
        <CryoButton
          variant="primary"
          size="lg"
          data-ocid={`${marker}.cta_button`}
        >
          <Snowflake className="h-4 w-4" />
          Create Your First Vault
        </CryoButton>
      </Link>
    </motion.div>
  );
}
