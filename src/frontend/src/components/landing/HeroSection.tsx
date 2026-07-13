/**
 * HeroSection — opening hero of the Froze pre-launch waitlist page.
 *
 * Single centered column: logo (nav position, top-left) → badge → headline →
 * description → waitlist form (rendered inline, immediately beneath the
 * description with a tight intentional gap so the form is the primary
 * above-the-fold focus, close to the tagline).
 *
 * Visual layers (back to front):
 *   1. Cryogenic vault background image — subtle (~20% opacity), object-cover,
 *      masked with a linear-gradient overlay so its edges dissolve into the
 *      #060a12 canvas. Sits BEHIND everything (z-0).
 *   2. .cryo-mesh-backlight — soft cyan radial glow positioned directly behind
 *      the text stack so the headline feels illuminated through deep ice.
 *   3. Content stack — logo, badge, headline, description, waitlist form (z-10).
 *
 * No bottom frost-melt gradient is layered over the hero: a prior band pinned
 * to bottom-0 at z-20 sat above the waitlist form (z-10) and covered it. The
 * form must remain fully visible and usable, so no gradient is placed near it.
 *
 * Strict 8px/16px spacing framework throughout.
 */
import { WaitlistForm } from "@/components/landing/WaitlistSection";
import { motion } from "motion/react";

const LOGO_SRC = "/assets/froze-logo.png";
const VAULT_BG_SRC = "/assets/generated/cryo-vault-bg.dim_1920x1080.png";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden"
    >
      {/* ── Layer 1: Subtle cryogenic vault background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <img
          src={VAULT_BG_SRC}
          alt=""
          className="h-full w-full object-cover opacity-20"
          loading="eager"
        />
        {/* Linear-gradient transparency mask: dissolve top + bottom edges into
            the #060a12 canvas, keep the middle faintly visible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #060a12 0%, rgba(6,10,18,0.55) 25%, rgba(6,10,18,0.15) 50%, rgba(6,10,18,0.55) 75%, #060a12 100%)",
          }}
        />
      </div>

      {/* ── Layer 2: Cyan mesh backlight behind the text stack ── */}
      <div aria-hidden className="cryo-mesh-backlight z-[1]" />

      {/* ── Layer 3: Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo — nav-style top-left. Larger so FROZE reads clearly.
            mix-blend-mode: screen dissolves the logo's pure-black (#000000)
            background into the dark navy (#060a12) page so only the glowing
            cyan FROZE text shows — no harsh black box. */}
        <div className="flex w-full">
          <img
            src={LOGO_SRC}
            alt="Froze — cryogenic savings vault logo"
            className="froze-logo h-12 w-auto sm:h-14"
            loading="eager"
          />
        </div>

        {/* Centered text stack — fills the remaining vertical space */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col items-center"
          >
            {/* Top banner badge — JetBrains Mono uppercase cyan micro-pill */}
            <span className="cryo-badge-pill" data-ocid="hero.pre_launch_badge">
              In Production · Join the Waitlist
            </span>

            {/* Headline — Space Grotesk 700, -0.02em, white→ice-blue gradient.
                Tagline used ONCE here; do not repeat elsewhere. */}
            <h1
              className="cryo-header-gradient font-display mt-8 text-5xl font-bold leading-[0.95] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Put Your Money on Ice
            </h1>

            {/* Supporting description — concise, premium tone */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Froze is a cryogenic savings vault that locks your money away in
              deep freeze — removing the temptation to spend so your future
              stays preserved.
            </p>

            {/* Waitlist form — primary above-the-fold focus, tight intentional
                gap (mt-8 = 32px) beneath the description. Flows naturally
                from the tagline; no large spacer reservation. */}
            <div className="mt-8 w-full">
              <WaitlistForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
