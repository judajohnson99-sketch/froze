import { useIsAdmin } from "@/hooks/useBackend";
/**
 * useAuth — provider-agnostic authentication context.
 *
 * Wraps Internet Identity (via @caffeineai/core-infrastructure) and
 * layers an admin check on top. The shape `{ principal, isAdmin,
 * signIn, signOut, identity, status }` is intentionally provider-
 * agnostic so Google/Apple/email SSO can be added later by swapping
 * the underlying provider without touching consumers.
 *
 * Admin semantics follow the authorization skill: the first signed-in
 * user becomes admin automatically. We additionally consult the
 * backend `isAdmin()` method when bound; until then we treat the
 * authenticated principal as admin (single-user admin app pre-launch).
 */
import {
  type InternetIdentityContext,
  useInternetIdentity,
} from "@caffeineai/core-infrastructure";
import type { Identity } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

export type AuthStatus =
  | "initializing"
  | "idle"
  | "logging-in"
  | "authenticated"
  | "error";

export interface AuthContextValue {
  /** The authenticated identity, or null when signed out. */
  identity: Identity | null;
  /** The principal as a string, or null when signed out. */
  principal: string | null;
  /** Principal object (for backend calls), or null. */
  principalObj: Principal | null;
  /** Whether the current user is an admin. */
  isAdmin: boolean;
  /** True only after the II client has finished restoring/initializing. */
  isInitializing: boolean;
  /** True while the II popup is open. */
  isLoggingIn: boolean;
  /** High-level auth status for gating UI. */
  status: AuthStatus;
  /** Sign in via the configured provider. */
  signIn: () => void;
  /** Sign out and clear all cached query data. */
  signOut: () => void;
  /** Last login error, if any. */
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function principalToString(p: Principal): string {
  return p.toString();
}

function identityToPrincipal(identity: Identity | null): Principal | null {
  if (!identity) return null;
  try {
    return identity.getPrincipal();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const ii: InternetIdentityContext = useInternetIdentity();
  const queryClient = useQueryClient();

  const principalObj = identityToPrincipal(ii.identity ?? null);
  const principal = principalObj ? principalToString(principalObj) : null;

  // Admin check: backend method when bound, else default true for the
  // authenticated user (single-admin app pre-launch per the auth skill).
  const isAdminQuery = useIsAdmin();
  const isAdmin = ii.identity ? (isAdminQuery.data ?? true) : false;

  const signIn = useCallback(() => {
    ii.login();
  }, [ii]);

  const signOut = useCallback(() => {
    ii.clear();
    queryClient.clear();
  }, [ii, queryClient]);

  const status: AuthStatus = useMemo(() => {
    if (ii.isInitializing) return "initializing";
    if (ii.isLoggingIn) return "logging-in";
    if (ii.identity) return "authenticated";
    if (ii.isLoginError) return "error";
    return "idle";
  }, [ii.isInitializing, ii.isLoggingIn, ii.identity, ii.isLoginError]);

  const value = useMemo<AuthContextValue>(
    () => ({
      identity: ii.identity ?? null,
      principal,
      principalObj,
      isAdmin,
      isInitializing: ii.isInitializing,
      isLoggingIn: ii.isLoggingIn,
      status,
      signIn,
      signOut,
      error: ii.loginError ?? null,
    }),
    [
      ii.identity,
      ii.isInitializing,
      ii.isLoggingIn,
      ii.loginError,
      principal,
      principalObj,
      isAdmin,
      status,
      signIn,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
