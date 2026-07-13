/**
 * WaitlistForm — premium glassmorphic waitlist email capture.
 *
 * Frosted glass email input (.cryo-glass-input) + glassmorphic cyan-glow
 * submit button (.cryo-glass-button + .cryo-glint diagonal sweep). Calls
 * `useAddToWaitlist` on submit; on success shows a ceremonial confirmation
 * with the user's position in line. The standalone "N savers already on
 * ice" counter under the form has been removed per design direction.
 *
 * This component is rendered inline inside HeroSection, immediately beneath
 * the hero description, so the form is the primary above-the-fold focus.
 * It owns no section wrapper, no ambient backdrop, and no vertical page
 * padding — those concerns belong to the hero.
 */
import { useAddToWaitlist, useWaitlistCount } from "@/hooks/useBackend";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";

const LOGO_WORDMARK_SRC = "/assets/generated/froze-wordmark.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Count is still fetched so the confirmation view can show the user's
  // position in line. It is NOT rendered as a standalone counter under
  // the form anymore.
  const countQuery = useWaitlistCount();
  const addMutation = useAddToWaitlist();

  const count = countQuery.data ?? BigInt(0);
  const isValid = EMAIL_RE.test(email);
  const showError = touched && email.length > 0 && !isValid;
  const isPending = addMutation.isPending;
  const isError = addMutation.isError;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || isPending) return;
    addMutation.mutate(email, {
      onSuccess: () => setSubmitted(true),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative z-10"
    >
      <div
        className="cryo-glass-strong cryo-condensation cryo-ice-facet relative overflow-hidden rounded-2xl p-6 sm:p-10"
        data-ocid="waitlist.card"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <ConfirmationView key="confirmation" count={count} />
          ) : (
            <FormView
              key="form"
              email={email}
              setEmail={setEmail}
              setTouched={setTouched}
              showError={showError}
              isError={isError}
              isPending={isPending}
              isValid={isValid}
              onSubmit={handleSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Form view ── */

interface FormViewProps {
  email: string;
  setEmail: (v: string) => void;
  setTouched: (v: boolean) => void;
  showError: boolean;
  isError: boolean;
  isPending: boolean;
  isValid: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function FormView({
  email,
  setEmail,
  setTouched,
  showError,
  isError,
  isPending,
  isValid,
  onSubmit,
}: FormViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <img
        src={LOGO_WORDMARK_SRC}
        alt="Froze logo"
        className="froze-logo mx-auto h-20 w-auto sm:h-28"
        loading="eager"
      />

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
        Now Accepting Sign-Ups
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-gradient-frost sm:text-3xl">
        Join the Waitlist
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Sign up for the waitlist to reserve your spot. We'll send a single
        confirmation — nothing more.
      </p>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-6 flex max-w-md flex-col gap-4 sm:flex-row sm:items-start"
        noValidate
      >
        <div className="flex-1 text-left">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your secure email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-label="Email address"
            aria-invalid={showError}
            aria-describedby="waitlist-email-error"
            disabled={isPending}
            data-ocid="waitlist.email_input"
            className="cryo-glass-input w-full font-body text-base placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {showError ? (
            <p
              id="waitlist-email-error"
              role="alert"
              data-ocid="waitlist.email.field_error"
              className="mt-2 text-xs text-destructive"
            >
              Enter a valid email address.
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isPending || !isValid}
          data-ocid="waitlist.submit_button"
          className="cryo-glass-button cryo-glint relative inline-flex shrink-0 items-center justify-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <span className="relative z-10">
            {isPending ? "Reserving…" : "Reserve Your Spot"}
          </span>
        </button>
      </form>

      {isError ? (
        <p
          role="alert"
          data-ocid="waitlist.error_state"
          className="mx-auto mt-4 max-w-md text-xs text-destructive"
        >
          Something went wrong on our end. Try again in a moment.
        </p>
      ) : null}
    </motion.div>
  );
}

/* ── Confirmation view ── */

function ConfirmationView({ count }: { count: bigint }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
      data-ocid="waitlist.success_state"
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl cryo-glass-strong">
        <CheckCircle2 className="h-7 w-7 text-[oklch(0.55_0.15_175)]" />
      </span>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
        Cryostasis Confirmed
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-gradient-frost sm:text-3xl">
        Your Vault Is Reserved
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        You're on the ice. We'll send a single confirmation to your inbox and
        reach out the moment Froze opens its doors.
      </p>

      <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-pill cryo-glass px-5 py-2.5">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          Position{" "}
          <span className="text-accent">
            #{(Number(count) + 1).toLocaleString()}
          </span>{" "}
          in line
        </span>
      </div>
    </motion.div>
  );
}

export default WaitlistForm;

/* ── Standalone section wrapper ──
 * Preserved for the `/waitlist` route (WaitlistPage), which renders the form
 * as a full standalone section with its own `#waitlist` anchor, ambient frost
 * backdrop, and `py-28` page padding. The inline hero form (WaitlistForm)
 * above is the bare card used inside HeroSection. */

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="relative mx-auto max-w-3xl scroll-mt-8 px-4 py-28 sm:px-6"
    >
      <div className="relative z-10">
        <WaitlistForm />
      </div>
    </section>
  );
}
