/**
 * LandingPagePlaceholder — minimal placeholder for the public `/`
 * route. The real landing page (hero, features, waitlist CTA) ships
 * in the next wave. For now it renders a frozen hero card with a
 * link to the waitlist section so the route is not a dead end.
 */
import { CryoButton, CryoCard } from "@/components/cryo";
import { Link } from "@tanstack/react-router";
import { Snowflake } from "lucide-react";
import { motion } from "motion/react";

export function LandingPagePlaceholder() {
  return (
    <section className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
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
          className="p-10 sm:p-14"
          data-ocid="landing.placeholder_card"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl cryo-glass-strong">
            <Snowflake className="h-8 w-8 text-accent animate-frozen-glow-pulse" />
          </span>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
            Cryo Vault
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gradient-frost sm:text-5xl">
            FROZE
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Money on ice. Discipline by design. The full landing experience
            crystallizes in the next wave.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/waitlist" data-ocid="landing.join_waitlist_link">
              <CryoButton variant="primary" size="lg">
                Join the waitlist
              </CryoButton>
            </Link>
          </div>
        </CryoCard>
      </motion.div>
    </section>
  );
}

export default LandingPagePlaceholder;
