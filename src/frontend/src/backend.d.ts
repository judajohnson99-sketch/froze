import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ReachedMilestone {
    percent: bigint;
    vaultId: bigint;
    milestone: Milestone;
    reachedAt: Timestamp;
}
export type Timestamp = bigint;
export type Sequence = bigint;
export type DepositResult = {
    __kind__: "ok";
    ok: {
        newBalance: bigint;
        transactionId: bigint;
    };
} | {
    __kind__: "insufficientReason";
    insufficientReason: null;
} | {
    __kind__: "duplicate";
    duplicate: null;
} | {
    __kind__: "invalidVault";
    invalidVault: null;
};
export interface LedgerEntry {
    idempotencyKey: IdempotencyKey;
    userId: UserId;
    side: EntrySide;
    description: string;
    triggeredBy: UserId;
    vaultId: bigint;
    timestamp: Timestamp;
    amount: bigint;
    sequence: Sequence;
    transactionId: bigint;
    reason: EntryReason;
}
export interface Achievement {
    id: bigint;
    title: string;
    userId: UserId;
    description: string;
    awardedAt: Timestamp;
}
export interface Job {
    id: bigint;
    status: JobStatus;
    idempotencyKey: IdempotencyKey;
    nextAttemptAt: Timestamp;
    kind: JobKind;
    createdAt: Timestamp;
    retryCount: bigint;
    lastError?: string;
    payload: string;
}
export interface VaultView {
    id: bigint;
    status: VaultStatus;
    unlockDate: Timestamp;
    goalName: string;
    note?: string;
    createdAt: Timestamp;
    progressPercent: bigint;
    targetAmount: bigint;
    currentAmount: bigint;
}
export interface Recommendation {
    id: bigint;
    title: string;
    userId: UserId;
    createdAt: Timestamp;
    rationale: string;
    cashFlowWarning?: string;
    disclaimer: string;
    suggestedPercent: bigint;
    suggestedDepositAdjustment?: {
        newAmount: bigint;
        vaultId: bigint;
    };
}
export interface RecurringDeposit {
    id: bigint;
    active: boolean;
    userId: UserId;
    createdAt: Timestamp;
    idempotencyKeyPrefix: IdempotencyKey;
    nextRunAt: Timestamp;
    vaultId: bigint;
    cadence: RecurringCadence;
    amount: bigint;
}
export interface GoalProgress {
    reachedMilestones: Array<Milestone>;
    percent: bigint;
    targetAmount: bigint;
    vaultId: bigint;
    currentAmount: bigint;
    nextMilestone?: Milestone;
}
export type Email = string;
export interface JobLogEntry {
    status: JobStatus;
    attempt: bigint;
    jobId: bigint;
    message: string;
    timestamp: Timestamp;
}
export interface GrowthAnalytics {
    newUsersLast30d: bigint;
    totalUsers: bigint;
    totalSavedAcrossVaults: bigint;
    averageVaultsPerUser: number;
    newUsersLast7d: bigint;
}
export interface VaultStats {
    status: string;
    depositCount: bigint;
    goalName: string;
    userId: UserId;
    targetAmount: bigint;
    vaultId: bigint;
    currentAmount: bigint;
}
export interface UserIdentity {
    principal: UserId;
    provider: IdentityProvider;
    isAdmin: boolean;
    registeredAt: Timestamp;
}
export interface SetupRecurringDepositRequest {
    idempotencyKeyPrefix: IdempotencyKey;
    vaultId: bigint;
    cadence: RecurringCadence;
    amount: bigint;
}
export type UserId = Principal;
export interface Entry {
    email: Email;
    timestamp: Timestamp;
}
export type IdempotencyKey = string;
export interface CreateVaultRequest {
    goalName: string;
    note?: string;
    lockDurationNs: Timestamp;
    targetAmount: bigint;
}
export interface Notification {
    id: bigint;
    title: string;
    body: string;
    userId: UserId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    read: boolean;
    vaultId?: bigint;
}
export interface AdminMetrics {
    deadLetterJobs: bigint;
    totalVaults: bigint;
    totalUsers: bigint;
    waitlistCount: bigint;
    pendingJobs: bigint;
    totalDeposits: bigint;
}
export interface ReconciliationResult {
    sumCredits: bigint;
    sumDebits: bigint;
    userId: UserId;
    vaultId: bigint;
    derivedBalance: bigint;
    balanced: boolean;
}
export enum EntryReason {
    recurringDeposit = "recurringDeposit",
    vaultLock = "vaultLock",
    interestReward = "interestReward",
    manualDeposit = "manualDeposit",
    vaultUnlock = "vaultUnlock",
    jobProcessing = "jobProcessing",
    withdrawal = "withdrawal",
    reconciliationAdjustment = "reconciliationAdjustment",
    vaultBreak = "vaultBreak"
}
export enum EntrySide {
    credit = "credit",
    debit = "debit"
}
export enum IdentityProvider {
    internetIdentity = "internetIdentity",
    apple = "apple",
    google = "google",
    email = "email"
}
export enum JobKind {
    unlockCheck = "unlockCheck",
    recurringDeposit = "recurringDeposit",
    interestReward = "interestReward",
    autoDeposit = "autoDeposit",
    optimizationRun = "optimizationRun",
    withdrawalProcess = "withdrawalProcess",
    milestoneCheck = "milestoneCheck"
}
export enum JobStatus {
    deadLetter = "deadLetter",
    pending = "pending",
    failed = "failed",
    running = "running",
    succeeded = "succeeded"
}
export enum Milestone {
    fifty = "fifty",
    seventyFive = "seventyFive",
    oneHundred = "oneHundred",
    twentyFive = "twentyFive"
}
export enum NotificationType {
    recommendationAvailable = "recommendationAvailable",
    unlockApproaching = "unlockApproaching",
    vaultUnlocked = "vaultUnlocked",
    milestoneReached = "milestoneReached",
    depositFrozen = "depositFrozen",
    adminBroadcast = "adminBroadcast"
}
export enum RecurringCadence {
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export enum VaultStatus {
    broken = "broken",
    freezing = "freezing",
    thawed = "thawed",
    thawing = "thawing"
}
/**
 * / Froze backend — composition root.
 * /
 * / Wires all domain modules together via mixins. No business logic lives
 * / here; every public function is delegated to a mixin. Stable state is
 * / declared here and passed into the mixins that need it.
 * /
 * / State shape change from the previous waitlist-only actor requires an
 * / explicit migration (see migration.mo).
 */
export interface backendInterface {
    addAdmin(principal: UserId): Promise<boolean>;
    addToWaitlist(email: Email): Promise<boolean>;
    cancelRecurringDeposit(recurringId: bigint): Promise<boolean>;
    createVault(request: CreateVaultRequest): Promise<bigint>;
    emailAlreadyExists(email: Email): Promise<boolean>;
    getAchievements(): Promise<Array<Achievement>>;
    getDeadLetterJobs(): Promise<Array<Job>>;
    getEmailTimestamp(email: string): Promise<Timestamp | null>;
    getGoalProgress(vaultId: bigint): Promise<GoalProgress>;
    getGrowthAnalytics(): Promise<GrowthAnalytics>;
    getJobLog(): Promise<Array<JobLogEntry>>;
    getMetrics(): Promise<AdminMetrics>;
    getMilestones(vaultId: bigint): Promise<Array<ReachedMilestone>>;
    getMyIdentity(): Promise<UserIdentity>;
    getMyPrincipal(): Promise<string>;
    getNotifications(): Promise<Array<Notification>>;
    getPendingJobCount(): Promise<bigint>;
    getRecommendationHistory(): Promise<Array<Recommendation>>;
    getRecommendations(): Promise<Recommendation>;
    getRecurringDeposits(): Promise<Array<RecurringDeposit>>;
    getVault(vaultId: bigint): Promise<VaultView | null>;
    getVaultLedger(vaultId: bigint): Promise<Array<LedgerEntry>>;
    getVaultStats(): Promise<Array<VaultStats>>;
    getVaults(): Promise<Array<VaultView>>;
    getWaitlist(): Promise<Array<Entry>>;
    getWaitlistCount(): Promise<bigint>;
    isAdmin(): Promise<boolean>;
    makeDeposit(vaultId: bigint, amount: bigint, idempotencyKey: IdempotencyKey, description: string): Promise<DepositResult>;
    markAllNotificationsRead(): Promise<bigint>;
    markRead(notificationId: bigint): Promise<boolean>;
    reconcileMyVaults(): Promise<Array<ReconciliationResult>>;
    reconcileVault(vaultId: bigint): Promise<ReconciliationResult>;
    setupRecurringDeposit(request: SetupRecurringDepositRequest): Promise<bigint>;
}
