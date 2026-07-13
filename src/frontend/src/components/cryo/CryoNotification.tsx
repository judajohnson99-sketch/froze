import { cn } from "@/lib/utils";
import type { NotificationKind } from "@/types/backend";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
/**
 * CryoNotification — floating frosted glass panel that auto-dismisses.
 * Types: success / warning / info. Use the `useCryoNotifications` hook
 * to push toasts; this component is the visual layer (rendered once by
 * the layout). For ad-hoc toasts prefer `toast()` from sonner.
 */
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useCallback, useState } from "react";

export interface CryoNotificationItem {
  id: number;
  kind: NotificationKind;
  title: string;
  description?: string;
}

export interface CryoNotificationProps {
  item: CryoNotificationItem;
  onDismiss: (id: number) => void;
}

const kindStyles: Record<
  NotificationKind,
  { icon: ReactNode; accent: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    accent: "text-[oklch(0.78_0.15_175)]",
  },
  warning: {
    icon: <TriangleAlert className="h-5 w-5" />,
    accent: "text-[oklch(0.82_0.14_85)]",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    accent: "text-[oklch(0.94_0.1_200)]",
  },
};

export function CryoNotification({ item, onDismiss }: CryoNotificationProps) {
  const style = kindStyles[item.kind];
  return (
    <motion.output
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="cryo-glass-strong cryo-condensation pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4"
    >
      <span className={cn("mt-0.5 shrink-0", style.accent)}>{style.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-medium text-foreground">
          {item.title}
        </p>
        {item.description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-pill p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.output>
  );
}

/** Container that renders the active stack. Mount once near the app root. */
export function CryoNotificationStack({
  items,
  onDismiss,
}: {
  items: CryoNotificationItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <CryoNotification key={item.id} item={item} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Imperative hook for pushing auto-dismissing cryo notifications. */
export function useCryoNotifications() {
  const [items, setItems] = useState<CryoNotificationItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const push = useCallback(
    (n: Omit<CryoNotificationItem, "id">) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { ...n, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return { items, push, dismiss };
}
