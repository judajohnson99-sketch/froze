import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminPage } from "@/pages/AdminPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DepositsPage } from "@/pages/DepositsPage";
import { GoalsPage } from "@/pages/GoalsPage";
import { LandingPage } from "@/pages/LandingPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { VaultsPage } from "@/pages/VaultsPage";
import { WaitlistPage } from "@/pages/WaitlistPage";
/**
 * router — TanStack Router code-based route tree.
 *
 * Tree shape:
 *   root
 *   ├─ public (PublicLayout)            ← unauthenticated chrome
 *   │   ├─ /          → LandingPage
 *   │   ├─ /waitlist  → WaitlistPage
 *   │   └─ /coming-soon → ComingSoonPage   (PUBLIC — not under AuthenticatedLayout,
 * │                                          avoids the redirect loop noted in learnings)
 *   └─ auth (AuthenticatedLayout)       ← admin-only protected chrome
 *       ├─ /onboarding      → OnboardingPage
 *       ├─ /dashboard       → DashboardPage
 *       ├─ /vaults          → VaultsPage
 *       ├─ /deposits        → DepositsPage
 *       ├─ /goals           → GoalsPage
 *       ├─ /notifications   → NotificationsPage
 *       └─ /admin           → AdminPage
 */
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

/* ── Root ─────────────────────────────────────── */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

/* ── Public layout + children ────────────────── */
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});

const landingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: LandingPage,
});

const waitlistRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/waitlist",
  component: WaitlistPage,
});

// ComingSoonPage is intentionally PUBLIC (not under AuthenticatedLayout)
// so non-admin authenticated users don't hit a redirect loop.
const comingSoonRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/coming-soon",
  component: ComingSoonPage,
});

/* ── Authenticated layout + children ──────────── */
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthenticatedLayout,
});

const onboardingRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const vaultsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/vaults",
  component: VaultsPage,
});

const depositsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/deposits",
  component: DepositsPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/goals",
  component: GoalsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/admin",
  component: AdminPage,
});

/* ── Build the tree ───────────────────────────── */
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([landingRoute, waitlistRoute, comingSoonRoute]),
  authLayoutRoute.addChildren([
    onboardingRoute,
    dashboardRoute,
    vaultsRoute,
    depositsRoute,
    goalsRoute,
    notificationsRoute,
    adminRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

/* Type the router for RouterProvider generics. */
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
