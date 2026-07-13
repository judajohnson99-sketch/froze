import { cn } from "@/lib/utils";
/**
 * CryoSidebar — vertical nav with cryo styling. Active state gets a
 * cyan glow rim and a left accent bar. Collapses to a drawer on small
 * screens (handled by the layout via the shadcn Sheet).
 */
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Snowflake,
  Target,
  Wallet,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export interface CryoNavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  marker: string;
}

export const CRYO_NAV_ITEMS: CryoNavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    marker: "nav.dashboard",
  },
  { to: "/vaults", label: "My Vaults", icon: Lock, marker: "nav.vaults" },
  { to: "/deposits", label: "Deposits", icon: Wallet, marker: "nav.deposits" },
  { to: "/goals", label: "Goals", icon: Target, marker: "nav.goals" },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
    marker: "nav.notifications",
  },
  {
    to: "/admin",
    label: "Control Room",
    icon: ShieldCheck,
    marker: "nav.admin",
  },
];

export interface CryoSidebarProps {
  /** Render inside a mobile drawer (no fixed positioning). */
  inDrawer?: boolean;
  onNavigate?: () => void;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <nav className="flex flex-col gap-1.5" aria-label="Primary">
      {CRYO_NAV_ITEMS.map((item) => {
        const active = location.pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            data-ocid={item.marker}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300",
              active
                ? "cryo-edge-glow bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
            )}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-pill bg-accent shadow-[0_0_12px_oklch(0.93_0.11_200/60%)]"
              />
            ) : null}
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2.5 px-2 py-1"
      aria-label="Froze home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-cryo-cyan-glow">
        <Snowflake className="h-5 w-5 text-primary-foreground" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-gradient-frost">
        FROZE
      </span>
    </Link>
  );
}

export function CryoSidebar({
  inDrawer = false,
  onNavigate,
}: CryoSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 p-4",
        !inDrawer && "cryo-glass border-r border-border/30",
      )}
    >
      <Brand />
      <div className="px-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          Vault Control
        </p>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto">
        <div className="cryo-glass rounded-xl p-3 text-xs text-muted-foreground">
          <p className="font-display font-medium text-foreground">Cryo Vault</p>
          <p className="mt-1">Money on ice. Discipline by design.</p>
        </div>
      </div>
    </div>
  );
}

/** Convenience wrapper for the mobile drawer body. */
export function CryoSidebarDrawerBody({
  onNavigate,
}: { onNavigate?: () => void }) {
  return (
    <div className="h-full">
      <CryoSidebar inDrawer onNavigate={onNavigate} />
    </div>
  );
}

export type { ReactNode };
