/**
 * SocialProofSection — testimonials beneath frosted glass.
 *
 * Testimonials start heavily blurred (cryo-glass with high blur) and
 * clear as the user scrolls — condensation evaporating to reveal the
 * words. Uses motion `useScroll` + `useTransform` to map scroll
 * progress to a decreasing blur and rising opacity.
 */
import { CryoCard } from "@/components/cryo";
import { Quote, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { type RefObject, useRef } from "react";

interface Testimonial {
  index: number;
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    index: 1,
    quote:
      "I finally saved for the trip I'd been talking about for two years. Once the money was frozen, spending it wasn't even an option in my head.",
    name: "Maya R.",
    role: "Saved for a Tokyo trip",
  },
  {
    index: 2,
    quote:
      "The vault metaphor is weirdly effective. Watching the ice thicken made me want to deposit more, not less.",
    name: "Devin K.",
    role: "Built a 6-month emergency fund",
  },
  {
    index: 3,
    quote:
      "I've tried six savings apps. This is the first one where I actually left the money alone. The lock is real.",
    name: "Priya S.",
    role: "Locked a wedding fund for 14 months",
  },
  {
    index: 4,
    quote:
      "Emergency withdrawal saved me when my car died. I broke the ice, got what I needed, and re-froze the rest. No guilt trip.",
    name: "Marcus T.",
    role: "Re-froze after an emergency",
  },
];

export function SocialProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef as RefObject<HTMLDivElement>,
    offset: ["start end", "end start"],
  });

  // Blur decreases (12px → 0px) and opacity rises (0.4 → 1) as the
  // section scrolls through the viewport — condensation clearing.
  const blur = useTransform(scrollYProgress, [0, 0.5], [12, 0]);
  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <section
      ref={sectionRef}
      id="social-proof"
      className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8"
    >
      <SectionHeading />

      <motion.div
        style={{ filter: blurFilter, opacity }}
        className="mt-16 grid gap-5 sm:grid-cols-2"
      >
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.index} testimonial={t} delay={i * 0.1} />
        ))}
      </motion.div>
    </section>
  );
}

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
        From the Vault
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gradient-frost sm:text-5xl">
        People Who Let It Freeze
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Scroll on — the condensation clears to reveal what savers say about
        leaving their money on ice.
      </p>
    </motion.div>
  );
}

function TestimonialCard({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <CryoCard
        strong
        condensation
        className="flex h-full flex-col p-7"
        data-ocid={`social_proof.item.${testimonial.index}.card`}
      >
        <div className="flex items-center justify-between">
          <Quote className="h-8 w-8 text-accent/60" />
          <div className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                // biome-ignore lint/suspicious/noArrayIndexKey: static star list with stable order
                key={i}
                className="h-4 w-4 fill-accent text-accent"
                aria-hidden
              />
            ))}
          </div>
        </div>

        <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground/90">
          “{testimonial.quote}”
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full cryo-glass-strong font-display text-sm font-semibold text-accent"
          >
            {testimonial.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-medium text-foreground">
              {testimonial.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {testimonial.role}
            </p>
          </div>
        </figcaption>
      </CryoCard>
    </motion.div>
  );
}

export default SocialProofSection;
