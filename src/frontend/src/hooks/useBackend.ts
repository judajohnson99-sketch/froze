import { createActor } from "@/backend";
import type { Entry, Timestamp } from "@/types/backend";
/**
 * useBackend — React Query hooks wrapping the backend actor.
 *
 * Uses the @caffeineai/core-infrastructure `useActor(createActor)` pattern.
 * The currently bound backend exposes the waitlist surface; the additional
 * vault / deposit / goal / notification / optimization / admin methods
 * listed in the dispatch will be added here once `pnpm bindgen` regenerates
 * backend.d.ts with the full actor interface.
 *
 * Existing waitlist hooks (useWaitlistCount, useAddToWaitlist, useGetWaitlist)
 * are preserved and re-exported from this module so pages have a single
 * import site. The legacy `useQueries.ts` re-exports them for back-compat.
 */
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor(createActor);
}

/* ───────────────────────── Waitlist ───────────────────────── */

export function useWaitlistCount() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<bigint>({
    queryKey: ["waitlist", "count"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getWaitlistCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetWaitlist() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Entry[]>({
    queryKey: ["waitlist", "list"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWaitlist();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddToWaitlist() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToWaitlist(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
}

export function useEmailAlreadyExists() {
  const { actor } = useBackendActor();
  return useMutation<boolean, Error, string>({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.emailAlreadyExists(email);
    },
  });
}

export function useGetEmailTimestamp(email: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Timestamp | null>({
    queryKey: ["waitlist", "email", email],
    queryFn: async () => {
      if (!actor || !email) return null;
      return actor.getEmailTimestamp(email);
    },
    enabled: !!actor && !isFetching && !!email,
  });
}

/* ───────────────────────── Auth / Admin ─────────────────────────
 * The bound backend does not yet expose `isAdmin` / `getMyPrincipal` /
 * `getMyIdentity` / `addAdmin`. When bindgen runs, add the matching
 * hooks here. For now `useAuth` (auth/useAuth.tsx) derives the principal
 * from the Internet Identity hook and treats the first signed-in user
 * as admin per the authorization skill's auto-admin behaviour.
 * ──────────────────────────────────────────────────────────────── */

export function useIsAdmin() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["auth", "isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      // Backend method will exist after bindgen; until then fall back to false.
      const a = actor as unknown as {
        isAdmin?: () => Promise<boolean>;
      };
      if (typeof a.isAdmin === "function") return a.isAdmin();
      return false;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    retry: false,
  });
}

export function useGetMyPrincipal() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string | null>({
    queryKey: ["auth", "myPrincipal"],
    queryFn: async () => {
      if (!actor) return null;
      const a = actor as unknown as {
        getMyPrincipal?: () => Promise<{ toText: () => string }>;
      };
      if (typeof a.getMyPrincipal === "function") {
        const p = await a.getMyPrincipal();
        return p.toText();
      }
      return null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    retry: false,
  });
}

/* ───────────────────────── Placeholder hooks ─────────────────────────
 * The following hooks are scaffolded against the planned 34-method
 * surface. They are guarded with `typeof` checks so they no-op until
 * the matching backend method is bound. Pages can import them today;
 * they will return empty/loading data and light up once bindgen runs.
 * ──────────────────────────────────────────────────────────────── */

function useOptionalQuery<T>(
  key: (string | null)[],
  methodName: string,
  enabled = true,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      if (!actor) return undefined as T;
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<T>
      >;
      if (typeof a[methodName] !== "function") return undefined as T;
      return a[methodName]();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 30_000,
    retry: false,
  });
}

export const useGetVaults = () =>
  useOptionalQuery<unknown[]>(["vaults"], "getVaults");
export const useGetVault = (id: string | null) =>
  useOptionalQuery<unknown>(["vault", id], "getVault", !!id);
export const useGetVaultLedger = (id: string | null) =>
  useOptionalQuery<unknown[]>(["vault", id, "ledger"], "getVaultLedger", !!id);
export const useGetRecurringDeposits = () =>
  useOptionalQuery<unknown[]>(
    ["deposits", "recurring"],
    "getRecurringDeposits",
  );
export const useGetGoalProgress = () =>
  useOptionalQuery<unknown>(["goals", "progress"], "getGoalProgress");
export const useGetMilestones = () =>
  useOptionalQuery<unknown[]>(["goals", "milestones"], "getMilestones");
export const useGetAchievements = () =>
  useOptionalQuery<unknown[]>(["goals", "achievements"], "getAchievements");
export const useGetNotifications = () =>
  useOptionalQuery<unknown[]>(["notifications"], "getNotifications");
export const useGetJobLog = () =>
  useOptionalQuery<unknown[]>(["admin", "jobLog"], "getJobLog");
export const useGetDeadLetterJobs = () =>
  useOptionalQuery<unknown[]>(["admin", "deadLetter"], "getDeadLetterJobs");
export const useGetPendingJobCount = () =>
  useOptionalQuery<bigint>(["admin", "pendingJobs"], "getPendingJobCount");
export const useGetRecommendations = () =>
  useOptionalQuery<unknown[]>(
    ["optimization", "recommendations"],
    "getRecommendations",
  );
export const useGetRecommendationHistory = () =>
  useOptionalQuery<unknown[]>(
    ["optimization", "history"],
    "getRecommendationHistory",
  );
export const useGetMetrics = () =>
  useOptionalQuery<unknown>(["admin", "metrics"], "getMetrics");
export const useGetVaultStats = () =>
  useOptionalQuery<unknown>(["admin", "vaultStats"], "getVaultStats");
export const useGetGrowthAnalytics = () =>
  useOptionalQuery<unknown>(["admin", "growth"], "getGrowthAnalytics");

/* ───────────────────────── Mutations ───────────────────────── */

function useOptionalMutation<TArgs, TResult>(
  methodName: string,
  invalidateKeys?: string[][],
) {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<TResult, Error, TArgs>({
    mutationFn: async (args: TArgs) => {
      if (!actor) throw new Error("Actor not available");
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<TResult>
      >;
      if (typeof a[methodName] !== "function") {
        throw new Error(`Backend method ${methodName} not bound`);
      }
      return a[methodName](args as unknown);
    },
    onSuccess: () => {
      if (invalidateKeys) {
        for (const key of invalidateKeys) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      }
    },
  });
}

export const useCreateVault = () =>
  useOptionalMutation<unknown, unknown>("createVault", [["vaults"]]);
export const useMakeDeposit = () =>
  useOptionalMutation<unknown, unknown>("makeDeposit", [["vaults"], ["vault"]]);
export const useSetupRecurringDeposit = () =>
  useOptionalMutation<unknown, unknown>("setupRecurringDeposit", [
    ["deposits"],
  ]);
export const useCancelRecurringDeposit = () =>
  useOptionalMutation<unknown, unknown>("cancelRecurringDeposit", [
    ["deposits", "recurring"],
  ]);
export const useReconcileVault = () =>
  useOptionalMutation<unknown, unknown>("reconcileVault", [["vaults"]]);
export const useReconcileMyVaults = () =>
  useOptionalMutation<unknown, unknown>("reconcileMyVaults", [["vaults"]]);
export const useMarkRead = () =>
  useOptionalMutation<unknown, unknown>("markRead", [["notifications"]]);
export const useMarkAllNotificationsRead = () =>
  useOptionalMutation<unknown, unknown>("markAllNotificationsRead", [
    ["notifications"],
  ]);
export const useAddAdmin = () =>
  useOptionalMutation<unknown, unknown>("addAdmin", [["auth", "isAdmin"]]);
