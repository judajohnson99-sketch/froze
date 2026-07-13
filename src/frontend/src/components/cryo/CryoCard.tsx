import { cn } from "@/lib/utils";
/**
 * CryoCard — frosted glass surface with backdrop blur, cyan edge glow,
 * and ice-facet corner catch. Optional `tier` prop swaps the vault
 * evolution shadow classes (cryo-vault-tier-1..4) so a single card
 * visually thickens its ice as the underlying value grows.
 */
import { type HTMLAttributes, forwardRef } from "react";

export interface CryoCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Stronger frost for modals / featured surfaces. */
  strong?: boolean;
  /** Add the cyan edge-glow rim (hover by default). */
  glow?: boolean;
  /** Add condensation droplet texture overlay. */
  condensation?: boolean;
  /** Add the angular ice-facet corner catch. */
  facet?: boolean;
  /** Vault evolution tier — thickens ice shadow as savings grow. */
  tier?: 1 | 2 | 3 | 4;
}

const tierClass: Record<1 | 2 | 3 | 4, string> = {
  1: "cryo-vault-tier-1",
  2: "cryo-vault-tier-2",
  3: "cryo-vault-tier-3",
  4: "cryo-vault-tier-4",
};

export const CryoCard = forwardRef<HTMLDivElement, CryoCardProps>(
  (
    {
      className,
      strong = false,
      glow = false,
      condensation = false,
      facet = false,
      tier,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          strong ? "cryo-glass-strong" : "cryo-glass",
          "rounded-2xl",
          glow && "cryo-edge-glow",
          condensation && "cryo-condensation",
          facet && "cryo-ice-facet",
          tier && tierClass[tier],
          className,
        )}
        {...props}
      />
    );
  },
);
CryoCard.displayName = "CryoCard";
