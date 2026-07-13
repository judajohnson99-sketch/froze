/**
 * WaitlistPagePlaceholder — minimal placeholder for the public
 * `/waitlist` route. The real waitlist section (with the email
 * capture form wired to useAddToWaitlist) ships in the next wave.
 * For now it renders a frozen card with a back-to-home link.
 */
import { CryoButton, CryoCard } from "@/components/cryo";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Snowflake } from "lucide-react";
import { motion } from "motion/react";

export function WaitlistPagePlaceholder() {
  return (
    <section className="relative mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <CryoCard
          strong
          condensation
          facet
          glow
          className="p-10 sm:p-12"
          data-ocid="waitlist.placeholder_card"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl cryo-glass-strong">
            <Snowflake className="h-7 w-7 text-accent" />
          </span>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
            Waitlist
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-gradient-frost sm:text-4xl">
            Reserve your spot on ice
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The waitlist form crystallizes in the next wave. For now, head back
            to the landing.
          </p>
          <div className="mt-8">
            <Link to="/" data-ocid="waitlist.back_home_link">
              <CryoButton variant="secondary" size="md">
                <ArrowLeft className="h-4 w-4" />
                Back to landing
              </CryoButton>
            </Link>
          </div>
        </CryoCard>
      </motion.div>
    </section>
  );
}

export default WaitlistPagePlaceholder;
