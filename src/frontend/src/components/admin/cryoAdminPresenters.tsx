/**
 * cryoAdminPresenters — small JSX presentational helpers shared across
 * the Admin Control Room sections. Kept separate from the pure
 * formatting helpers in `cryoAdminHelpers.ts` so that file can stay a
 * `.ts` module.
 */
import type { ReactNode } from "react";

export interface CryoSectionHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  marker?: string;
}

/** Shared section header used by every admin CryoCard section. */
export function CryoSectionHeader({
  title,
  description,
  icon,
  action,
  marker,
}: CryoSectionHeaderProps) {
  return (
    <div
      className="flex flex-wrap items-start justify-between gap-3"
      data-ocid={marker}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent shadow-cryo-cyan-glow">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Empty-state block for a section with no data yet. */
export function CryoEmptyState({
  message,
  hint,
  marker,
}: {
  message: string;
  hint?: string;
  marker?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-12 text-center"
      data-ocid={marker ?? "admin.empty_state"}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
        {message}
      </p>
      {hint ? <p className="text-xs text-muted-foreground/60">{hint}</p> : null}
    </div>
  );
}
