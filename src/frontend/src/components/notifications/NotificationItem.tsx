import type { Notification, NotificationType } from "@/backend";
import { CryoCard } from "@/components/cryo";
import { cn } from "@/lib/utils";
/**
 * NotificationItem — single frosted-glass panel in the notification
 * center. Renders a type-specific lucide icon, title, body, relative
 * timestamp, and a read/unread state. Unread items carry a cyan glow
 * accent and an unread dot. Clicking an unread item marks it read
 * via the parent's onMarkRead handler.
 */
import {
  Award,
  Clock,
  Lightbulb,
  Lock,
  type LucideIcon,
  Megaphone,
  Snowflake,
} from "lucide-react";
import { motion } from "motion/react";

const TYPE_META: Record<
  NotificationType,
  { icon: LucideIcon; tint: string; ring: string }
> = {
  depositFrozen: {
    icon: Snowflake,
    tint: "text-accent",
    ring: "shadow-[0_0_0_1px_oklch(0.94_0.1_200/30%),0_0_24px_oklch(0.94_0.1_200/18%)]",
  },
  milestoneReached: {
    icon: Award,
    tint: "text-[oklch(0.82_0.14_85)]",
    ring: "shadow-[0_0_0_1px_oklch(0.82_0.14_85/30%),0_0_24px_oklch(0.82_0.14_85/18%)]",
  },
  unlockApproaching: {
    icon: Clock,
    tint: "text-[oklch(0.78_0.15_175)]",
    ring: "shadow-[0_0_0_1px_oklch(0.78_0.15_175/30%),0_0_24px_oklch(0.78_0.15_175/18%)]",
  },
  vaultUnlocked: {
    icon: Lock,
    tint: "text-primary",
    ring: "shadow-[0_0_0_1px_oklch(0.62_0.19_258/30%),0_0_24px_oklch(0.62_0.19_258/18%)]",
  },
  recommendationAvailable: {
    icon: Lightbulb,
    tint: "text-accent",
    ring: "shadow-[0_0_0_1px_oklch(0.94_0.1_200/30%),0_0_24px_oklch(0.94_0.1_200/18%)]",
  },
  adminBroadcast: {
    icon: Megaphone,
    tint: "text-foreground",
    ring: "shadow-[0_0_0_1px_oklch(0.86_0.015_240/22%),0_0_24px_oklch(0.62_0.19_258/14%)]",
  },
};

/** Format a backend Timestamp (nanos since epoch) as a relative string. */
export function formatRelativeTime(nanos: bigint): string {
  const ms = Number(nanos / BigInt(1_000_000));
  const diffMs = Date.now() - ms;
  if (diffMs < 0) return "just now";
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk} week${wk === 1 ? "" : "s"} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`;
  const yr = Math.floor(day / 365);
  return `${yr} year${yr === 1 ? "" : "s"} ago`;
}

export interface NotificationItemProps {
  notification: Notification;
  index: number;
  onMarkRead: (id: bigint) => void;
}

export function NotificationItem({
  notification,
  index,
  onMarkRead,
}: NotificationItemProps) {
  const meta = TYPE_META[notification.notificationType];
  const Icon = meta.icon;
  const unread = !notification.read;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index * 0.05, 0.4),
      }}
    >
      <CryoCard
        tabIndex={unread ? 0 : -1}
        aria-label={`${notification.title}${unread ? " — unread" : ""}`}
        onClick={unread ? () => onMarkRead(notification.id) : undefined}
        onKeyDown={(e) => {
          if (unread && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onMarkRead(notification.id);
          }
        }}
        condensation={unread}
        className={cn(
          "group relative cursor-pointer p-4 transition-all duration-300",
          "hover:-translate-y-0.5 hover:cryo-edge-glow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          unread && meta.ring,
          !unread && "opacity-70 hover:opacity-100",
        )}
        data-ocid={`notifications.item.${index + 1}`}
      >
        <div className="relative z-[3] flex items-start gap-3.5">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl cryo-glass",
              meta.tint,
              unread && "animate-frozen-glow-pulse",
            )}
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-sm font-semibold leading-snug text-foreground">
                {notification.title}
              </h3>
              {unread ? (
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_10px_oklch(0.93_0.11_200/70%)]"
                  aria-label="Unread"
                />
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {notification.body}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </CryoCard>
    </motion.div>
  );
}
