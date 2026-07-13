import type { VaultView } from "@/backend";
import { CryoButton } from "@/components/cryo";
import { EmptyVaultsState } from "@/components/vaults/EmptyVaultsState";
import { VaultGrid } from "@/components/vaults/VaultGrid";
import { useGetVaults } from "@/hooks/useBackend";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Snowflake } from "lucide-react";
import { motion } from "motion/react";

/**
 * VaultsPage — "My Vaults" admin page.
 *
 * Header: title + "Create New Vault" CryoButton (links to /onboarding).
 * Body: responsive grid of CryoVaultCards from useGetVaults, with
 * skeleton loading state and a ceremonial empty state.
 */
export function VaultsPage() {
  const { data, isLoading } = useGetVaults();
  const navigate = useNavigate();
  const vaults = (data ?? []) as unknown as VaultView[];

  return (
    <div className="space-y-8" data-ocid="vaults.page">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
            Cryo Vault Control
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-gradient-cryo sm:text-4xl">
            My Vaults
          </h1>
          <p className="mt-2 max-w-xl font-body text-sm text-muted-foreground">
            Each vault is a block of ice with a goal, a balance, and a lock
            schedule. Watch the frost thicken as your savings freeze into
            something permanent.
          </p>
        </div>
        <Link to="/onboarding" data-ocid="vaults.create_button">
          <CryoButton variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Create New Vault
          </CryoButton>
        </Link>
      </motion.header>

      {/* Body */}
      {isLoading ? (
        <VaultGridSkeleton />
      ) : vaults.length === 0 ? (
        <EmptyVaultsState />
      ) : (
        <VaultGrid vaults={vaults} />
      )}

      {/* Hidden nav helper for screen readers / programmatic create */}
      <button
        type="button"
        className="sr-only"
        onClick={() => navigate({ to: "/onboarding" })}
        data-ocid="vaults.create_button_sr"
        aria-label="Create new vault"
      >
        <Snowflake className="h-4 w-4" />
        Create
      </button>
    </div>
  );
}

/** Skeleton loading state — frosted glass placeholders shaped like vault cards. */
function VaultGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      data-ocid="vaults.loading_state"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          key={`skeleton-${i}`}
          className="cryo-glass h-72 animate-pulse rounded-2xl"
          data-ocid={`vaults.skeleton.item.${i + 1}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default VaultsPage;
