/**
 * ComingSoonPage — ceremonial cryo "vault sealed" page shown to
 * non-admin users after II auth. Confirms they're on the waitlist
 * and tells them the app isn't open yet. Dark cryo styling with
 * frosted glass, cyan glow, and ice motifs.
 */
import { useAuth } from "@/auth";
import { CryoButton, CryoCard } from "@/components/cryo";
import { useGetEmailTimestamp } from "@/hooks/useBackend";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Lock, Snowflake } from "lucide-react";
import { motion } from "motion/react";

export function ComingSoonPage() {
  const { principal, signOut } = useAuth();
  const navigate = useNavigate();
  // The waitlist is keyed by email; we don't have the user's email here,
  // so we show a generic confirmation. The hook stays enabled so a real
  // lookup can be wired in once the email is captured.
  useGetEmailTimestamp(null);

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      {/* Ambient aurora + drifting particles */}
      <div
        aria-hidden
        className="cryo-aurora pointer-events-none absolute inset-x-0 top-0 h-48 opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 2px 2px at 20% 30%, oklch(0.93 0.11 200 / 30%) 0%, transparent 100%), radial-gradient(ellipse 2px 2px at 70% 60%, oklch(0.94 0.1 200 / 24%) 0%, transparent 100%), radial-gradient(ellipse 2px 2px at 40% 80%, oklch(0.93 0.11 200 / 28%) 0%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <CryoCard
          strong
          condensation
          facet
          glow
          className="p-8 sm:p-10 text-center"
          data-ocid="coming_soon.card"
        >
          {/* Sealed vault emblem */}
          <div className="relative mx-auto mb-8 grid h-24 w-24 place-items-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full animate-frozen-glow-pulse"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.93 0.11 200 / 22%) 0%, transparent 70%)",
              }}
            />
            <div className="relative grid h-20 w-20 place-items-center rounded-full cryo-glass-strong">
              <Lock className="h-8 w-8 text-accent" />
            </div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
            Vault Sealed
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-gradient-frost sm:text-4xl">
            The vault isn't open yet
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            You're on the waitlist — your spot is frozen in. Froze opens to
            everyone soon. Until then, your savings stay on ice.
          </p>

          {/* Waitlist confirmation row */}
          <div className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-sm text-foreground">
              You're on the waitlist
            </span>
          </div>

          {principal ? (
            <p
              className="mt-4 font-mono text-[11px] text-muted-foreground/70"
              data-ocid="coming_soon.principal"
            >
              Signed in as {principal.slice(0, 10)}…{principal.slice(-6)}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <CryoButton
              variant="primary"
              size="md"
              onClick={() => navigate({ to: "/waitlist" })}
              data-ocid="coming_soon.view_waitlist_button"
            >
              <Snowflake className="h-4 w-4" />
              View waitlist
            </CryoButton>
            <CryoButton
              variant="ghost"
              size="md"
              onClick={signOut}
              data-ocid="coming_soon.signout_button"
            >
              Sign out
            </CryoButton>
          </div>

          <p className="mt-8 text-xs text-muted-foreground/60">
            Questions?{" "}
            <Link
              to="/"
              className="text-accent hover:text-frost transition-colors"
              data-ocid="coming_soon.home_link"
            >
              Return to landing
            </Link>
          </p>
        </CryoCard>
      </motion.div>
    </div>
  );
}

export default ComingSoonPage;
