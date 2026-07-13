/**
 * ActivityFeed — dashboard section combining recent notifications and
 * savings-optimization recommendations into a single cryo feed.
 *
 * Each item renders as a CryoCard with a kind-tinted icon, title,
 * description/rationale, and (for recommendations) a disclaimer line.
 * Recommendations carry an explicit disclaimer that they are
 * informational, not financial advice — matching the requirement to
 * surface rationale + disclaimer.
 *
 * Loading: skeleton rows. Empty: a quiet "all clear" frost panel.
 */
import { CryoCard } from "@/components/cryo";
import { cn } from "@/lib/utils";
import {
  Bell,
  Lightbulb,
  type LucideIcon,
  ShieldAlert,
  Snowflake,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Normalized feed item — backend shapes are coerced into this. */
export interface FeedItem {
  id: string;
  kind: "notification" | "recommendation";
  /** Sub-type for icon/accent tinting. */
  tone: "info" | "success" | "warning" | "tip";
  title: string;
  description?: string;
  /** Optional rationale (recommendations). */
  rationale?: string;
  /** Optional disclaimer (recommendations). */
  disclaimer?: string;
}

export interface ActivityFeedProps {
  notifications?: unknown[];
  recommendations?: unknown[];
  isLoading?: boolean;
  marker?: string;
}

/* ── Coercion helpers ──────────────────────────────────────────────
 * The backend hooks return `unknown[]` until bindgen binds the real
 * record shapes. These helpers defensively coerce any plausible shape
 * into a normalized FeedItem so the dashboard renders real content
 * today and lights up unchanged once the typed bindings land.
 * ────────────────────────────────────────────────────────────────── */

function asString(v: unknown): string | undefined {
  if (typeof v === "string" && v.length > 0) return v;
  return undefined;
}

function pick(obj: unknown, keys: string[]): unknown {
  if (obj && typeof obj === "object") {
    for (const k of keys) {
      const val = (obj as Record<string, unknown>)[k];
      if (val !== undefined && val !== null) return val;
    }
  }
  return undefined;
}

function coerceNotification(raw: unknown, idx: number): FeedItem | null {
  const title =
    asString(pick(raw, ["title", "message", "text", "body", "summary"])) ??
    "Vault update";
  const description = asString(
    pick(raw, ["description", "detail", "details", "content", "note"]),
  );
  const kindRaw = asString(pick(raw, ["kind", "type", "level", "severity"]));
  const tone: FeedItem["tone"] =
    kindRaw === "success" || kindRaw === "milestone"
      ? "success"
      : kindRaw === "warning" || kindRaw === "alert"
        ? "warning"
        : "info";
  const id = asString(pick(raw, ["id", "notificationId"])) ?? `notif-${idx}`;
  return { id, kind: "notification", tone, title, description };
}

function coerceRecommendation(raw: unknown, idx: number): FeedItem | null {
  const title =
    asString(pick(raw, ["title", "headline", "name", "label"])) ??
    "Optimization opportunity";
  const rationale = asString(
    pick(raw, ["rationale", "reason", "explanation", "why", "description"]),
  );
  const description = asString(pick(raw, ["summary", "description", "detail"]));
  const id = asString(pick(raw, ["id", "recommendationId"])) ?? `rec-${idx}`;
  return {
    id,
    kind: "recommendation",
    tone: "tip",
    title,
    description: description ?? rationale,
    rationale,
    disclaimer:
      "Informational only — not financial advice. Review before acting.",
  };
}

const toneStyles: Record<
  FeedItem["tone"],
  { icon: LucideIcon; accent: string; ring: string }
> = {
  info: {
    icon: Bell,
    accent: "text-[oklch(0.94_0.1_200)]",
    ring: "ring-[oklch(0.94_0.1_200/22%)]",
  },
  success: {
    icon: Snowflake,
    accent: "text-[oklch(0.78_0.15_175)]",
    ring: "ring-[oklch(0.78_0.15_175/24%)]",
  },
  warning: {
    icon: ShieldAlert,
    accent: "text-[oklch(0.82_0.14_85)]",
    ring: "ring-[oklch(0.82_0.14_85/26%)]",
  },
  tip: {
    icon: Lightbulb,
    accent: "text-[oklch(0.93_0.11_200)]",
    ring: "ring-[oklch(0.93_0.11_200/24%)]",
  },
};

function FeedRow({ item, index }: { item: FeedItem; index: number }) {
  const style = toneStyles[item.tone];
  const Icon = style.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <CryoCard
        condensation
        className={cn(
          "relative overflow-hidden p-4 ring-1 ring-inset",
          style.ring,
        )}
        data-ocid={`dashboard.activity.item.${index + 1}`}
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted/40",
              style.accent,
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-display text-sm font-medium text-foreground">
                {item.title}
              </p>
              <span className="shrink-0 rounded-pill bg-muted/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.kind === "recommendation" ? "Tip" : "Signal"}
              </span>
            </div>
            {item.description ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {item.disclaimer ? (
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground/60">
                {item.disclaimer}
              </p>
            ) : null}
          </div>
        </div>
      </CryoCard>
    </motion.div>
  );
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <CryoCard
      className="p-4"
      data-ocid={`dashboard.activity.loading_state.${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-muted/40" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 animate-pulse rounded-pill bg-muted/40" />
          <div className="h-3 w-full animate-pulse rounded-pill bg-muted/30" />
          <div className="h-3 w-4/5 animate-pulse rounded-pill bg-muted/30" />
        </div>
      </div>
    </CryoCard>
  );
}

export function ActivityFeed({
  notifications,
  recommendations,
  isLoading = false,
  marker = "dashboard.activity",
}: ActivityFeedProps) {
  const items: FeedItem[] = [];
  if (Array.isArray(recommendations)) {
    for (let i = 0; i < recommendations.length; i++) {
      const c = coerceRecommendation(recommendations[i], i);
      if (c) items.push(c);
    }
  }
  if (Array.isArray(notifications)) {
    for (let i = 0; i < notifications.length; i++) {
      const c = coerceNotification(notifications[i], i);
      if (c) items.push(c);
    }
  }
  // Cap the feed so the dashboard stays scannable.
  const feed = items.slice(0, 6);

  let body: ReactNode;
  if (isLoading) {
    body = (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonRow
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            key={`skeleton-${i}`}
            index={i}
          />
        ))}
      </div>
    );
  } else if (feed.length === 0) {
    body = (
      <CryoCard
        condensation
        className="flex flex-col items-center gap-3 p-8 text-center"
        data-ocid={`${marker}.empty_state`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
          <Snowflake className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-sm font-medium text-foreground">
            All clear on the ice
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            No new signals or optimization tips. The vault is steady.
          </p>
        </div>
      </CryoCard>
    );
  } else {
    body = (
      <div className="space-y-3">
        {feed.map((item, i) => (
          <FeedRow key={item.id} item={item} index={i} />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-8" data-ocid={marker}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/70">
          Cold Vapor
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
          Activity &amp; Recommendations
        </h2>
      </div>
      <div className="mt-4">{body}</div>
    </section>
  );
}

export default ActivityFeed;
