import { DepositHistory } from "@/components/deposits/DepositHistory";
/**
 * DepositsPage — manual + recurring deposit control room.
 *
 * Layout (mobile-first):
 *   - Page header (title + descriptor)
 *   - ManualDepositForm (full width on mobile, left column on lg)
 *   - RecurringDepositForm + RecurringDepositList (stacked, right column on lg)
 *   - DepositHistory (full width)
 *
 * Entrance animations stagger per section via whileInView.
 */
import { ManualDepositForm } from "@/components/deposits/ManualDepositForm";
import { RecurringDepositForm } from "@/components/deposits/RecurringDepositForm";
import { RecurringDepositList } from "@/components/deposits/RecurringDepositList";
import { Snowflake } from "lucide-react";
import { motion } from "motion/react";

export function DepositsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8" data-ocid="deposits.page">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start gap-3"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl cryo-glass">
          <Snowflake className="h-6 w-6 text-accent" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
            Cryo Vault
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-gradient-frost sm:text-4xl">
            Deposits
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Manual deposits and recurring transfers — every entry lands in the
            append-only ledger. Schedule a recurring freeze and let the vault
            fill itself.
          </p>
        </div>
      </motion.header>

      {/* Manual + Recurring grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ManualDepositForm />
        <div className="space-y-6">
          <RecurringDepositForm />
          <RecurringDepositList />
        </div>
      </div>

      {/* History */}
      <DepositHistory />
    </div>
  );
}

export default DepositsPage;
