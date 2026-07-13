import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
/**
 * CryoTabBar — horizontal tabs with cryo styling. Active tab gets a
 * cyan glow underline. Built on the shadcn Tabs primitive.
 */
import type * as React from "react";

export interface CryoTabItem {
  value: string;
  label: string;
  marker?: string;
}

export interface CryoTabBarProps
  extends Omit<React.ComponentProps<typeof Tabs>, "children"> {
  items: CryoTabItem[];
  children?: React.ReactNode;
  className?: string;
}

export function CryoTabBar({
  items,
  children,
  className,
  ...tabsProps
}: CryoTabBarProps) {
  return (
    <Tabs {...tabsProps} className={cn("w-full", className)}>
      <TabsList className="cryo-glass h-auto gap-1 rounded-2xl p-1.5">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            data-ocid={item.marker}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all data-[state=active]:cryo-edge-glow data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
