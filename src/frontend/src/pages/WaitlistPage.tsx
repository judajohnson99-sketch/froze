/**
 * WaitlistPage — public `/waitlist` route. Renders the real
 * WaitlistSection (email capture wired to useAddToWaitlist) inside
 * the dark cryo vault background, framed as a standalone page with
 * a back-to-home affordance.
 */
import { CryoButton } from "@/components/cryo";
import { WaitlistSection } from "@/components/landing/WaitlistSection";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function WaitlistPage() {
  return (
    <div className="relative">
      <div className="mx-auto flex max-w-3xl px-4 pt-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" data-ocid="waitlist.back_home_link">
            <CryoButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </CryoButton>
          </Link>
        </motion.div>
      </div>

      <WaitlistSection />
    </div>
  );
}

export default WaitlistPage;
