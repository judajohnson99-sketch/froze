/**
 * FinalCTASection — closing call-to-action with snowfall and mist.
 *
 * Snowfall particles drift down (snowfall animation) and mist rises
 * (mist-rising) across the section. Headline + a single primary CTA
 * that smooth-scrolls to the waitlist section.
 */
import { CryoButton } from "@/components/cryo";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useCallback, useMemo } from "react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** A single falling snow particle. */
function SnowflakeParticle({
  delay,
  duration,
  left,
  size,
}: {
  delay: number;
  duration: number;
  left: string;
  size: number;
}) {
  return (
    <span
      aria-hidden
      className="animate-snowfall absolute top-0 rounded-full bg-frost/80"
      style={{
        left,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        boxShadow: "0 0 6px oklch(0.93 0.11 200 / 60%)",
      }}
    />
  );
}

/** A rising mist band. */
function MistBand({
  delay,
  left,
  width,
}: { delay: number; left: string; width: string }) {
  return (
    <span
      aria-hidden
      className="animate-mist-rising absolute bottom-0 rounded-full"
      style={{
        left,
        width,
        height: "50%",
        background:
          "radial-gradient(ellipse at center, oklch(0.93 0.11 200 / 18%) 0%, transparent 70%)",
        filter: "blur(24px)",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export function FinalCTASection() {
  const handleOpenVault = useCallback(() => scrollToId("waitlist"), []);

  // Pre-compute snowflake positions once.
  const snowflakes = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        delay: (i * 0.7) % 12,
        duration: 9 + ((i * 1.3) % 6),
        left: `${(i * 5.5) % 100}%`,
        size: 2 + ((i * 0.4) % 4),
      })),
    [],
  );

  return (
    <section
      id="final-cta"
      className="relative scroll-mt-8 overflow-hidden bg-muted/20 py-28"
    >
      {/* Snowfall + mist layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {snowflakes.map((s) => (
          <SnowflakeParticle
            key={s.id}
            delay={s.delay}
            duration={s.duration}
            left={s.left}
            size={s.size}
          />
        ))}
        <MistBand delay={0} left="5%" width="40%" />
        <MistBand delay={2} left="35%" width="45%" />
        <MistBand delay={4} left="65%" width="40%" />
      </div>

      {/* Ambient aurora */}
      <div
        aria-hidden
        className="cryo-aurora pointer-events-none absolute inset-x-0 top-1/2 h-48 -translate-y-1/2 opacity-50"
      />

      <FinalCTAContent onOpenVault={handleOpenVault} />
    </section>
  );
}

function FinalCTAContent({
  onOpenVault,
}: {
  onOpenVault: () => void;
}): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6"
    >
      <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-gradient-cryo sm:text-5xl lg:text-6xl">
        Start Building Savings
        <br />
        That Stay Saved.
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        The first vault is the hardest to open and the easiest to keep. Reserve
        yours today.
      </p>
      <div className="mt-10 flex justify-center">
        <CryoButton
          variant="primary"
          size="lg"
          onClick={onOpenVault}
          data-ocid="final_cta.open_vault_button"
        >
          Open Your First Vault
          <ArrowRight className="h-4 w-4" />
        </CryoButton>
      </div>
    </motion.div>
  );
}

export default FinalCTASection;
