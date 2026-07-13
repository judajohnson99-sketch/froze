import { CryoCard } from "@/components/cryo";
/**
 * DashboardPage — the admin-only Cryo Vault overview.
 *
 * Feels like stepping into a futuristic ice vault: dark cryo background
 * with an aurora glow band, a welcome header with the current date, a
 * row of four CryoStatCards (total frozen funds, active vaults, next
 * unlock countdown, savings streak), a vault preview (up to 3
 * CryoVaultCards with a View All link), and an activity feed of recent
 * notifications + optimization recommendations.
 *
 * Data flows through useGetVaults / useGetNotifications /
 * useGetRecommendations from useBackend. The hooks return `unknown[]`
 * until bindgen binds the real shapes, so vaults are defensively
 * coerced into the local Vault type. Realistic seed vaults are shown
 * on first load so the dashboard is never empty (admin preview).
 */
import { ActivityFeed, StatsRow, VaultPreview } from "@/components/dashboard";
import {
  useGetNotifications,
  useGetRecommendations,
  useGetVaults,
} from "@/hooks/useBackend";
import type { Vault, VaultStatus } from "@/types/backend";
import { Snowflake } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

/* ── Vault coercion ────────────────────────────────────────────────
 * useGetVaults returns unknown[] until bindgen. Coerce any plausible
 * backend record shape into the local Vault type so the dashboard
 * renders real content today and lights up unchanged once typed
 * bindings land.
 * ──────────────────────────────────────────────────────────────── */

const NANO = 1_000_000n;

function asString(v: unknown): string | undefined {
  if (typeof v === "string" && v.length > 0) return v;
  return undefined;
}

function asBigInt(v: unknown): bigint | undefined {
  if (typeof v === "bigint") return v;
  if (typeof v === "number" && Number.isFinite(v)) return BigInt(Math.trunc(v));
  if (typeof v === "string" && /^\d+$/.test(v)) return BigInt(v);
  return undefined;
}

function pick(obj: unknown, keys: string[]): unknown {
  if (obj && typeof obj === "object") {
    for (const k of keys) {
      const val = (obj as Record<string, unknown>)[k];
      if (val !== undefined && val !== null) return val;
    }
  }
  return undefined;
}

function coerceStatus(v: unknown): VaultStatus {
  const s = asString(v)?.toLowerCase();
  if (s === "thawing" || s === "thawed" || s === "broken") return s;
  return "freezing";
}

function coerceVault(raw: unknown, idx: number): Vault | null {
  if (!raw || typeof raw !== "object") return null;
  const id = asString(pick(raw, ["id", "vaultId"])) ?? `vault-${idx}`;
  const goalName =
    asString(pick(raw, ["goalName", "name", "goal", "title", "label"])) ??
    "Untitled Vault";
  const currentAmount =
    asBigInt(pick(raw, ["currentAmount", "balance", "frozen", "amount"])) ?? 0n;
  const targetAmount =
    asBigInt(pick(raw, ["targetAmount", "target", "goalAmount"])) ?? 0n;
  const unlockAt =
    asBigInt(
      pick(raw, ["unlockAt", "unlockDate", "unlocksAt", "unlockTime"]),
    ) ?? BigInt(Date.now() + 14 * 86_400_000) * NANO;
  const lockedAt =
    asBigInt(pick(raw, ["lockedAt", "createdAt", "created", "lockDate"])) ??
    BigInt(Date.now() - 30 * 86_400_000) * NANO;
  const status = coerceStatus(pick(raw, ["status", "state"]));
  return {
    id,
    goalName,
    currentAmount,
    targetAmount,
    unlockAt,
    lockedAt,
    status,
  };
}

/* ── Seed vaults — realistic content so the dashboard is never
 * empty on first load (admin preview). Replaced by real backend data
 * the moment useGetVaults returns a non-empty array.
 * ──────────────────────────────────────────────────────────────── */

const NOW = Date.now();
const day = 86_400_000;
const SEED_VAULTS: Vault[] = [
  {
    id: "seed-emergency",
    goalName: "Emergency Ice Reserve",
    currentAmount: 8_400n,
    targetAmount: 10_000n,
    unlockAt: BigInt(NOW + 14 * day) * NANO,
    lockedAt: BigInt(NOW - 90 * day) * NANO,
    status: "freezing",
  },
  {
    id: "seed-sabbatical",
    goalName: "Sabbatical Glacier",
    currentAmount: 3_200n,
    targetAmount: 12_000n,
    unlockAt: BigInt(NOW + 220 * day) * NANO,
    lockedAt: BigInt(NOW - 45 * day) * NANO,
    status: "freezing",
  },
  {
    id: "seed-downpayment",
    goalName: "Down Payment Frost",
    currentAmount: 15_750n,
    targetAmount: 25_000n,
    unlockAt: BigInt(NOW + 5 * day) * NANO,
    lockedAt: BigInt(NOW - 120 * day) * NANO,
    status: "thawing",
  },
];

function formatDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardPage() {
  const vaultsQuery = useGetVaults();
  const notificationsQuery = useGetNotifications();
  const recommendationsQuery = useGetRecommendations();

  const vaults = useMemo<Vault[]>(() => {
    const raw = vaultsQuery.data;
    if (!Array.isArray(raw) || raw.length === 0) return SEED_VAULTS;
    const coerced = raw
      .map((r, i) => coerceVault(r, i))
      .filter((v): v is Vault => v !== null);
    return coerced.length > 0 ? coerced : SEED_VAULTS;
  }, [vaultsQuery.data]);

  // Streak: derived placeholder — 6 consecutive weeks of saving activity.
  const streakWeeks = 6;

  const isFeedLoading =
    notificationsQuery.isLoading || recommendationsQuery.isLoading;

  return (
    <div className="relative" data-ocid="dashboard.page">
      {/* Aurora glow band behind the header */}
      <div
        aria-hidden
        className="cryo-aurora animate-aurora-glow pointer-events-none absolute -top-16 left-0 right-0 h-40 opacity-50"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {/* Welcome header */}
        <CryoCard
          strong
          condensation
          facet
          className="overflow-hidden p-6 sm:p-8"
          data-ocid="dashboard.header"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-cryo-cyan-glow">
                <Snowflake className="h-6 w-6 text-primary-foreground" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
                  Cryo Vault
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-gradient-frost sm:text-3xl">
                  Your Cryo Vault
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {formatDate()}
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A frozen overview of every vault — total on ice, the next
              milestone condensing on the horizon, and signals drifting through
              the cold vapor.
            </p>
          </div>
        </CryoCard>

        {/* Stats row */}
        <div className="mt-6">
          <StatsRow vaults={vaults} streakWeeks={streakWeeks} />
        </div>

        {/* Vault preview */}
        <VaultPreview vaults={vaults} />

        {/* Activity & recommendations */}
        <ActivityFeed
          notifications={notificationsQuery.data}
          recommendations={recommendationsQuery.data}
          isLoading={isFeedLoading}
        />
      </motion.div>
    </div>
  );
}

export default DashboardPage;
