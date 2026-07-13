import { CryoTabBar, type CryoTabItem } from "@/components/cryo";
/**
 * NotificationFilters — CryoTabBar wrapper that filters the
 * notification center by type bucket. Values map to backend
 * NotificationType variants; "all" shows everything. Admin
 * broadcasts are intentionally excluded from the filter set per
 * the in-app-only admin spec.
 */
export type NotificationFilterValue =
  | "all"
  | "deposits"
  | "milestones"
  | "unlocks"
  | "recommendations";

export interface NotificationFiltersProps {
  value: NotificationFilterValue;
  onChange: (value: NotificationFilterValue) => void;
  /** Counts per filter, keyed by filter value. Optional. */
  counts?: Partial<Record<NotificationFilterValue, number>>;
}

const FILTER_ITEMS: (CryoTabItem & { value: NotificationFilterValue })[] = [
  { value: "all", label: "All", marker: "notifications.filter.all" },
  {
    value: "deposits",
    label: "Deposits",
    marker: "notifications.filter.deposits",
  },
  {
    value: "milestones",
    label: "Milestones",
    marker: "notifications.filter.milestones",
  },
  {
    value: "unlocks",
    label: "Unlocks",
    marker: "notifications.filter.unlocks",
  },
  {
    value: "recommendations",
    label: "Recommendations",
    marker: "notifications.filter.recommendations",
  },
];

export function NotificationFilters({
  value,
  onChange,
  counts,
}: NotificationFiltersProps) {
  const items: CryoTabItem[] = FILTER_ITEMS.map((item) => {
    const count = counts?.[item.value];
    const suffix = typeof count === "number" && count > 0 ? ` · ${count}` : "";
    return { ...item, label: `${item.label}${suffix}` };
  });

  return (
    <CryoTabBar
      items={items}
      value={value}
      onValueChange={(v) => onChange(v as NotificationFilterValue)}
    />
  );
}
