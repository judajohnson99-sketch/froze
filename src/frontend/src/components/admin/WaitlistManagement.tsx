import type { Entry } from "@/backend";
import { CryoCard } from "@/components/cryo/CryoCard";
import { CryoInput } from "@/components/cryo/CryoInput";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetWaitlist, useWaitlistCount } from "@/hooks/useBackend";
import { Mail, Search, Users } from "lucide-react";
import { motion } from "motion/react";
/**
 * WaitlistManagement — CryoCard with the waitlist table, email search,
 * and a prominent waitlist count badge. Uses `useGetWaitlist` (typed
 * `Entry[]`) and `useWaitlistCount`.
 */
import { useMemo, useState } from "react";
import { formatSignupDate, toBigInt } from "./cryoAdminHelpers";
import { CryoEmptyState, CryoSectionHeader } from "./cryoAdminPresenters";

function isEntry(v: unknown): v is Entry {
  return !!v && typeof v === "object" && typeof (v as Entry).email === "string";
}

export function WaitlistManagement() {
  const { data, isLoading } = useGetWaitlist();
  const { data: count } = useWaitlistCount();
  const [query, setQuery] = useState("");

  const rows = useMemo<Entry[]>(() => {
    const list = Array.isArray(data) ? data.filter(isEntry) : [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((e) => e.email.toLowerCase().includes(q));
  }, [data, query]);

  const total = toBigInt(count);

  return (
    <CryoCard
      condensation
      className="p-5 sm:p-6"
      data-ocid="admin.waitlist.card"
    >
      <CryoSectionHeader
        title="Waitlist"
        description="Early-access signups awaiting launch invite."
        marker="admin.waitlist.header"
        icon={<Mail className="h-5 w-5" />}
        action={
          <Badge
            variant="secondary"
            className="cryo-glass gap-1.5 px-3 py-1.5 text-sm font-semibold tabular-nums text-accent"
            data-ocid="admin.waitlist.count"
          >
            <Users className="h-3.5 w-3.5" />
            {total.toLocaleString()} signed up
          </Badge>
        }
      />

      <div className="relative mt-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
        <CryoInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search email…"
          aria-label="Filter waitlist by email"
          className="pl-10"
          data-ocid="admin.waitlist.search_input"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
              <TableHead className="pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                Email
              </TableHead>
              <TableHead className="pr-4 text-right font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                Signup Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  <span data-ocid="admin.waitlist.loading_state">
                    Thawing the list…
                  </span>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <CryoEmptyState
                    message={query ? "No matching emails" : "Waitlist is empty"}
                    hint={
                      query
                        ? "Try a different search term."
                        : "Signups will appear here."
                    }
                    marker="admin.waitlist.empty_state"
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.slice(0, 100).map((entry, i) => (
                <motion.tr
                  key={`${entry.email}-${i}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                  className="border-border/40 transition-colors hover:bg-accent/5"
                  data-ocid={`admin.waitlist.item.${i + 1}`}
                >
                  <TableCell className="py-3 pl-4 font-mono text-sm text-foreground">
                    {entry.email}
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right text-sm tabular-nums text-muted-foreground">
                    {formatSignupDate(entry.timestamp)}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {rows.length > 100 ? (
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">
          Showing first 100 of {rows.length.toLocaleString()}
        </p>
      ) : null}
    </CryoCard>
  );
}

export default WaitlistManagement;
