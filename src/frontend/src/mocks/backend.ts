/* eslint-disable */
// @ts-nocheck
/**
 * Mock backend for visual QA + frontend-only iteration.
 *
 * Loaded by @caffeineai/core-infrastructure when VITE_USE_MOCK=true.
 * Implements the full backendInterface surface so any page can render
 * without a live canister. Values are realistic but static.
 */
import type { backendInterface } from "../backend";

const SAMPLE_PRINCIPAL = "2vxsx-fae" as any; // anonymous-ish principal text

const mockWaitlist: { email: string; timestamp: bigint }[] = [
  { email: "arctic.saver@example.com", timestamp: BigInt(1_700_000_000_000_000_000) },
  { email: "frost.walker@example.com", timestamp: BigInt(1_700_000_001_000_000_000) },
  { email: "polar.vault@example.com", timestamp: BigInt(1_700_000_002_000_000_000) },
];

export const mockBackend: backendInterface = {
  addAdmin: async () => true,
  addToWaitlist: async (email: string) => {
    mockWaitlist.push({ email, timestamp: BigInt(Date.now()) * BigInt(1_000_000) });
    return true;
  },
  cancelRecurringDeposit: async () => true,
  createVault: async () => BigInt(1),
  emailAlreadyExists: async (email: string) =>
    mockWaitlist.some((e) => e.email === email),
  getAchievements: async () => [
    {
      id: BigInt(1),
      title: "First Freeze",
      userId: SAMPLE_PRINCIPAL,
      description: "You locked your first vault.",
      awardedAt: BigInt(1_700_000_000_000_000_000),
    },
  ],
  getDeadLetterJobs: async () => [],
  getEmailTimestamp: async (email: string) => {
    const entry = mockWaitlist.find((e) => e.email === email);
    return entry ? entry.timestamp : null;
  },
  getGoalProgress: async (vaultId: bigint) => ({
    reachedMilestones: [],
    percent: BigInt(25),
    targetAmount: BigInt(10_000),
    vaultId,
    currentAmount: BigInt(2_500),
    nextMilestone: "twentyFive" as any,
  }),
  getGrowthAnalytics: async () => ({
    newUsersLast30d: BigInt(42),
    totalUsers: BigInt(128),
    totalSavedAcrossVaults: BigInt(1_250_000),
    averageVaultsPerUser: 1.8,
    newUsersLast7d: BigInt(12),
  }),
  getJobLog: async () => [],
  getMetrics: async () => ({
    deadLetterJobs: BigInt(0),
    totalVaults: BigInt(3),
    totalUsers: BigInt(128),
    waitlistCount: BigInt(mockWaitlist.length),
    pendingJobs: BigInt(0),
    totalDeposits: BigInt(54),
  }),
  getMilestones: async () => [],
  getMyIdentity: async () => ({
    principal: SAMPLE_PRINCIPAL,
    provider: "internetIdentity" as any,
    isAdmin: false,
    registeredAt: BigInt(1_700_000_000_000_000_000),
  }),
  getMyPrincipal: async () => SAMPLE_PRINCIPAL,
  getNotifications: async () => [],
  getPendingJobCount: async () => BigInt(0),
  getRecommendationHistory: async () => [],
  getRecommendations: async () => ({
    id: BigInt(1),
    title: "Steady Freeze",
    userId: SAMPLE_PRINCIPAL,
    createdAt: BigInt(1_700_000_000_000_000_000),
    rationale: "Increase weekly deposits to hit your goal on time.",
    disclaimer: "Conceptual only. No real money movement.",
    suggestedPercent: BigInt(15),
  }),
  getRecurringDeposits: async () => [],
  getVault: async () => null,
  getVaultLedger: async () => [],
  getVaultStats: async () => [],
  getVaults: async () => [],
  getWaitlist: async () => mockWaitlist,
  getWaitlistCount: async () => BigInt(mockWaitlist.length),
  isAdmin: async () => false,
  makeDeposit: async () => ({ __kind__: "ok", ok: { newBalance: BigInt(2_500), transactionId: BigInt(1) } } as any),
  markAllNotificationsRead: async () => BigInt(0),
  markRead: async () => true,
  reconcileMyVaults: async () => [],
  reconcileVault: async (vaultId: bigint) => ({
    sumCredits: BigInt(2_500),
    sumDebits: BigInt(0),
    userId: SAMPLE_PRINCIPAL,
    vaultId,
    derivedBalance: BigInt(2_500),
    balanced: true,
  }),
  setupRecurringDeposit: async () => BigInt(1),
};
