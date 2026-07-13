/**
 * PagePlaceholder — minimal CryoCard placeholder for protected routes
 * whose real pages ship in the next wave. Renders the page title, a
 * short cryo descriptor, and a "coming in next wave" note so the
 * admin control room is navigable today.
 */
import { CryoCard } from "@/components/cryo";
import { Snowflake } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface PagePlaceholderProps {
  title: string;
  descriptor: string;
  /** Optional extra content rendered inside the card body. */
  children?: ReactNode;
  marker: string;
}

export function PagePlaceholder({
  title,
  descriptor,
  children,
  marker,
}: PagePlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-3xl"
    >
      <CryoCard
        strong
        condensation
        facet
        className="p-8 sm:p-10"
        data-ocid={marker}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl cryo-glass">
            <Snowflake className="h-5 w-5 text-accent" />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
              Cryo Vault
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-gradient-frost">
              {title}
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {descriptor}
        </p>

        {children ? (
          <div className="mt-6">{children}</div>
        ) : (
          <div className="mt-6 rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              This section crystallizes in the next wave.
            </p>
          </div>
        )}
      </CryoCard>
    </motion.div>
  );
}

export default PagePlaceholder;
