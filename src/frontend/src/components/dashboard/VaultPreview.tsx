/**
 * VaultPreview — dashboard section showing up to 3 of the user's vaults
 * rendered as CryoVaultCards, with a "View All" link to /vaults.
 *
 * Handles the empty state: when there are no vaults, renders a frosted
 * prompt inviting the admin to create their first vault via /onboarding.
 */
import { CryoButton, CryoCard, CryoVaultCard } from "@/components/cryo";
import type { Vault } from "@/types/backend";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Snowflake } from "lucide-react";
import { motion } from "motion/react";

export interface VaultPreviewProps {
  vaults: Vault[];
  /** Max number of vault cards to show. */
  limit?: number;
  marker?: string;
}

export function VaultPreview({
  vaults,
  limit = 3,
  marker = "dashboard.vault_preview",
}: VaultPreviewProps) {
  const navigate = useNavigate();
  const preview = vaults.slice(0, limit);

  const goVaults = () => navigate({ to: "/vaults" });
  const goOnboarding = () => navigate({ to: "/onboarding" });

  return (
    <section className="mt-8" data-ocid={marker}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/70">
            On Ice
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            Your Vaults
          </h2>
        </div>
        {vaults.length > 0 ? (
          <CryoButton
            variant="ghost"
            size="sm"
            onClick={goVaults}
            data-ocid={`${marker}.view_all_link`}
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </CryoButton>
        ) : null}
      </div>

      {preview.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <CryoCard
            condensation
            facet
            className="flex flex-col items-center gap-4 p-8 text-center sm:p-10"
            data-ocid={`${marker}.empty_state`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent shadow-cryo-cyan-glow">
              <Snowflake className="h-7 w-7" />
            </span>
            <div className="max-w-sm">
              <h3 className="font-display text-lg font-semibold text-foreground">
                The vault is empty
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                No savings on ice yet. Start your first freeze — name a goal,
                set a target, and lock it in the cryo chamber.
              </p>
            </div>
            <CryoButton
              variant="primary"
              size="md"
              onClick={goOnboarding}
              data-ocid={`${marker}.empty_state.create_button`}
            >
              <Snowflake className="h-4 w-4" />
              Create your first vault
            </CryoButton>
          </CryoCard>
        </motion.div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {preview.map((vault, i) => (
            <motion.div
              key={vault.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <CryoVaultCard
                goalName={vault.goalName}
                currentAmount={vault.currentAmount}
                targetAmount={vault.targetAmount}
                unlockAt={vault.unlockAt}
                lockedAt={vault.lockedAt}
                status={vault.status}
                marker={`${marker}.item.${i + 1}`}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default VaultPreview;
