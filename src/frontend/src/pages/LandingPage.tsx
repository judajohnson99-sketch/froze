import { FeaturesSection } from "@/components/landing/FeaturesSection";
/**
 * LandingPage — Froze pre-launch waitlist acquisition page.
 *
 * Single purpose: collect waitlist sign-ups. The page is trimmed to four
 * cohesive sections, top to bottom:
 *
 *   Hero (with inline waitlist form) → FeaturesSection → ProductPreview → Footer
 *
 * The HeroSection owns the `#hero` anchor, the headline/description stack,
 * and the waitlist form (rendered inline immediately beneath the description
 * so the form is the primary above-the-fold focus, close to the tagline).
 * FeaturesSection and ProductPreview are built in parallel by other engineers
 * and imported here. Footer closes the page at the bottom.
 *
 * Strict 8px/16px spacing framework throughout.
 */
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductPreview } from "@/components/landing/ProductPreview";

export function LandingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <HeroSection />
      <FeaturesSection />
      <ProductPreview />
      <Footer />
    </div>
  );
}

export default LandingPage;
