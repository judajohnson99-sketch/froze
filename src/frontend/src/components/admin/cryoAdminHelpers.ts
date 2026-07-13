/**
 * cryoAdminHelpers — shared formatting helpers used across the Admin
 * Control Room sections. Pure functions only (no JSX) so this file
 * stays a `.ts` module. JSX presentational helpers live in
 * `cryoAdminPresenters.tsx`.
 */

/** Format a bigint nanos-since-epoch timestamp as a localized date string. */
export function formatSignupDate(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  return new Date(ms).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a bigint amount with thousands separators. */
export function formatAmount(nat: bigint): string {
  const n = Number(nat.toString());
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/** Compact number formatting for large counts (e.g. 12.4K). */
export function formatCompact(nat: bigint | number): string {
  const n = typeof nat === "bigint" ? Number(nat.toString()) : nat;
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Shorten a principal string for table display. */
export function shortPrincipal(p: string): string {
  if (!p || p.length < 12) return p || "—";
  return `${p.slice(0, 6)}…${p.slice(-4)}`;
}

/** Defensive bigint extractor from an unknown value. */
export function toBigInt(v: unknown, fallback = 0n): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number" && Number.isFinite(v)) return BigInt(Math.trunc(v));
  if (typeof v === "string" && /^\d+$/.test(v)) return BigInt(v);
  return fallback;
}

/** Defensive number extractor from an unknown value. */
export function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "bigint") return Number(v.toString());
  if (typeof v === "string" && /^\d+(\.\d+)?$/.test(v)) return Number(v);
  return fallback;
}

/** Defensive string extractor from an unknown value. */
export function toText(v: unknown, fallback = "—"): string {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  try {
    return String(v);
  } catch {
    return fallback;
  }
}
