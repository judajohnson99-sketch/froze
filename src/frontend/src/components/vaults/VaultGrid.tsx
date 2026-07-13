import type { LedgerEntry, VaultView } from "@/backend";
import { CryoVaultCard } from "@/components/cryo";
import type { VaultStatus } from "@/types/backend";
import { motion } from "motion/react";
import { VaultDetailModal } from "./VaultDetailModal";

/**
 * VaultGrid — responsive grid of CryoVaultCards.
 *
 * 1 column on mobile, 2 on tablet, 3 on desktop. Each card opens a
 * VaultDetailModal on click, which fetches the full ledger for that
 * vault via useGetVaultLedger.
 *
 * Cards stagger in with a frost entrance and visually evolve per the
 * CryoVaultCard tier/status system (ice thickens with progress,
 * melting/shatter animations for thawing/broken).
 */
export interface VaultGridProps {
  vaults: VaultView[];
  /** Stable marker prefix for data-ocid. */
  marker?: string;
}

export function VaultGrid({ vaults, marker = "vaults" }: VaultGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {vaults.map((vault, index) => (
        <VaultGridItem
          key={String(vault.id)}
          vault={vault}
          index={index}
          marker={`${marker}.item.${index + 1}`}
        />
      ))}
    </div>
  );
}

function VaultGridItem({
  vault,
  index,
  marker,
}: {
  vault: VaultView;
  index: number;
  marker: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <VaultDetailModal
        vault={vault}
        trigger={
          <button
            type="button"
            className="block w-full cursor-pointer text-left focus-visible:outline-none"
            aria-label={`Open vault ${vault.goalName} details`}
            data-ocid={marker}
          >
            <CryoVaultCard
              goalName={vault.goalName}
              currentAmount={vault.currentAmount}
              targetAmount={vault.targetAmount}
              unlockAt={vault.unlockDate}
              lockedAt={vault.createdAt}
              status={vault.status as VaultStatus}
              className="h-full transition-transform duration-300 hover:-translate-y-1"
              marker={marker}
            />
          </button>
        }
      />
    </motion.div>
  );
}

/** Re-export the ledger type for callers that compose the grid. */
export type { LedgerEntry, VaultView };
