import { NotificationType } from "@/backend";
import type { Notification } from "@/backend";
import { CryoButton, CryoCard } from "@/components/cryo";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkRead,
} from "@/hooks/useBackend";
import { BellOff, CheckCheck, Snowflake } from "lucide-react";
/**
 * NotificationCenter — the full in-app notification history view.
 * Pulls notifications via useGetNotifications, renders a header
 * with a "Mark All Read" action, filter tabs, the list of
 * NotificationItem panels, and a frosted empty state. Loading
 * shows skeleton panels; mutations invalidate the notifications
 * query so the list refreshes after marking read.
 */
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  type NotificationFilterValue,
  NotificationFilters,
} from "./NotificationFilters";
import { NotificationItem } from "./NotificationItem";

const FILTER_TO_TYPES: Record<
  Exclude<NotificationFilterValue, "all">,
  NotificationType[]
> = {
  deposits: [NotificationType.depositFrozen],
  milestones: [NotificationType.milestoneReached],
  unlocks: [NotificationType.unlockApproaching, NotificationType.vaultUnlocked],
  recommendations: [NotificationType.recommendationAvailable],
};

function NotificationSkeleton({ index }: { index: number }) {
  return (
    <CryoCard
      className="p-4"
      data-ocid={`notifications.loading_state.${index + 1}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted/40" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded-pill bg-muted/40" />
          <div className="h-3 w-full animate-pulse rounded-pill bg-muted/30" />
          <div className="h-3 w-1/4 animate-pulse rounded-pill bg-muted/20" />
        </div>
      </div>
    </CryoCard>
  );
}

function EmptyState() {
  return (
    <CryoCard
      strong
      condensation
      facet
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
      data-ocid="notifications.empty_state"
    >
      <span className="grid h-16 w-16 place-items-center rounded-2xl cryo-glass">
        <BellOff className="h-7 w-7 text-accent/70" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-gradient-frost">
        No notifications yet
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Your vault activity will appear here.
      </p>
      <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
        <Snowflake className="h-3 w-3" />
        Vault sealed
      </p>
    </CryoCard>
  );
}

export function NotificationCenter() {
  const { data, isLoading, isFetching } = useGetNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [filter, setFilter] = useState<NotificationFilterValue>("all");

  const notifications = useMemo(() => {
    const list = (data ?? []) as Notification[];
    if (filter === "all") return list;
    const types = FILTER_TO_TYPES[filter];
    return list.filter((n) => types.includes(n.notificationType));
  }, [data, filter]);

  const allList = (data ?? []) as Notification[];
  const unreadCount = allList.filter((n) => !n.read).length;

  const counts = useMemo(() => {
    const c: Partial<Record<NotificationFilterValue, number>> = {
      all: allList.length,
    };
    for (const key of Object.keys(FILTER_TO_TYPES) as Exclude<
      NotificationFilterValue,
      "all"
    >[]) {
      const types = FILTER_TO_TYPES[key];
      c[key] = allList.filter((n) => types.includes(n.notificationType)).length;
    }
    return c;
  }, [allList]);

  const showSkeletons = isLoading || (isFetching && !data);

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
            Cryo Vault
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-gradient-frost sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread signal${unreadCount === 1 ? "" : "s"} on ice`
              : "All signals acknowledged. Vault is calm."}
          </p>
        </div>
        <CryoButton
          variant="secondary"
          size="sm"
          onClick={() => markAllRead.mutate(undefined)}
          disabled={unreadCount === 0 || markAllRead.isPending}
          data-ocid="notifications.mark_all_read_button"
        >
          <CheckCheck className="h-4 w-4" />
          <span>Mark All Read</span>
        </CryoButton>
      </div>

      {/* Filters */}
      <NotificationFilters
        value={filter}
        onChange={setFilter}
        counts={counts}
      />

      {/* List */}
      {showSkeletons ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <NotificationSkeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              key={i}
              index={i}
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="flex flex-col gap-3"
          data-ocid="notifications.list"
        >
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <NotificationItem
                key={String(n.id)}
                notification={n}
                index={i}
                onMarkRead={(id) => markRead.mutate(id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
