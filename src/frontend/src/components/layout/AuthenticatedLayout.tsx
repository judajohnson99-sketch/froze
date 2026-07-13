/**
 * AuthenticatedLayout — shared shell for all admin-only protected
 * routes. Renders the CryoSidebar on desktop and a Sheet drawer on
 * mobile, a top bar with the user's principal + sign-out, and an
 * <Outlet> for page content.
 *
 * Auth gating: if the user is not authenticated, redirect to the
 * public landing. If authenticated but not an admin, redirect to
 * /coming-soon (the ceremonial cryo "vault sealed" page).
 */
import { useAuth } from "@/auth";
import { CryoSidebar, CryoSidebarDrawerBody } from "@/components/cryo";
import { CryoButton } from "@/components/cryo";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Snowflake } from "lucide-react";
import { useEffect, useState } from "react";

function PrincipalBadge({ principal }: { principal: string }) {
  const short = `${principal.slice(0, 6)}…${principal.slice(-4)}`;
  return (
    <span
      className="font-mono text-xs text-muted-foreground"
      title={principal}
      data-ocid="auth.principal_badge"
    >
      {short}
    </span>
  );
}

function TopBar({
  onOpenMenu,
  principal,
  onSignOut,
}: {
  onOpenMenu: () => void;
  principal: string | null;
  onSignOut: () => void;
}) {
  return (
    <header className="cryo-glass sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/30 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <CryoButton
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation"
          data-ocid="auth.open_drawer_button"
        >
          <Menu className="h-5 w-5" />
        </CryoButton>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-cryo-cyan-glow">
            <Snowflake className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-gradient-frost">
            FROZE
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {principal ? <PrincipalBadge principal={principal} /> : null}
        <CryoButton
          variant="secondary"
          size="sm"
          onClick={onSignOut}
          data-ocid="auth.signout_button"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </CryoButton>
      </div>
    </header>
  );
}

export function AuthenticatedLayout() {
  const { status, principal, isAdmin, isInitializing, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // While II is restoring, show a frozen loading state.
  const isRestoring = isInitializing || status === "initializing";
  const isUnauthenticated = !isRestoring && status !== "authenticated";
  const isNonAdmin = !isRestoring && status === "authenticated" && !isAdmin;

  // Auth gating lives in an effect so navigate() never fires during
  // render (which would trip React's setState-during-render warning).
  useEffect(() => {
    if (isUnauthenticated) {
      navigate({ to: "/" });
    } else if (isNonAdmin) {
      navigate({ to: "/coming-soon" });
    }
  }, [isUnauthenticated, isNonAdmin, navigate]);

  if (isRestoring) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="cryo-glass rounded-2xl px-8 py-6 text-center">
          <Snowflake className="mx-auto h-8 w-8 animate-frozen-glow-pulse text-accent" />
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Thawing vault…
          </p>
        </div>
      </div>
    );
  }

  // Redirecting — render nothing while the effect navigates.
  if (isUnauthenticated || isNonAdmin) {
    return null;
  }

  return (
    <div className="relative min-h-dvh">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 md:block">
          <CryoSidebar />
        </aside>

        {/* Mobile drawer */}
        {isMobile ? (
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <span className="sr-only">
                <button type="button">Menu</button>
              </span>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-r border-border/30 p-0"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <CryoSidebarDrawerBody onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
        ) : null}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            onOpenMenu={() => setDrawerOpen(true)}
            principal={principal}
            onSignOut={signOut}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedLayout;
