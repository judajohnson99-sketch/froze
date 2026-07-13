/**
 * Legacy waitlist hooks — re-exported from useBackend.ts so existing
 * imports keep working during the monolith split. New code should
 * import directly from `@/hooks/useBackend`.
 */
export type { Entry } from "@/types/backend";
export {
  useAddToWaitlist,
  useGetWaitlist,
  useWaitlistCount,
} from "@/hooks/useBackend";
