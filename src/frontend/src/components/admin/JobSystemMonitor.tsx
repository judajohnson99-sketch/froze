import type { Job, JobLogEntry, JobStatus } from "@/backend";
import { CryoCard } from "@/components/cryo/CryoCard";
import { CryoStatCard } from "@/components/cryo/CryoStatCard";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetDeadLetterJobs,
  useGetJobLog,
  useGetPendingJobCount,
} from "@/hooks/useBackend";
import { Activity, AlertOctagon, Clock, Cog } from "lucide-react";
import { motion } from "motion/react";
/**
 * JobSystemMonitor — CryoCard showing the pending job count, the dead
 * letter queue, and the recent job log. Pulls from three hooks:
 * `useGetPendingJobCount`, `useGetDeadLetterJobs`, `useGetJobLog`.
 */
import { useMemo } from "react";
import { formatSignupDate, toBigInt, toText } from "./cryoAdminHelpers";
import { CryoEmptyState, CryoSectionHeader } from "./cryoAdminPresenters";

const STATUS_TONE: Record<string, string> = {
  pending: "text-accent border-accent/40 bg-accent/10",
  running: "text-primary border-primary/40 bg-primary/10",
  succeeded:
    "text-[oklch(0.78_0.15_175)] border-[oklch(0.78_0.15_175)]/40 bg-[oklch(0.78_0.15_175)]/10",
  failed: "text-warning border-warning/40 bg-warning/10",
  deadLetter: "text-destructive border-destructive/40 bg-destructive/10",
};

function isJob(v: unknown): v is Job {
  return (
    !!v &&
    typeof v === "object" &&
    "id" in (v as Record<string, unknown>) &&
    "kind" in (v as Record<string, unknown>)
  );
}

function isJobLog(v: unknown): v is JobLogEntry {
  return (
    !!v &&
    typeof v === "object" &&
    "jobId" in (v as Record<string, unknown>) &&
    "timestamp" in (v as Record<string, unknown>)
  );
}

function statusText(s: unknown): string {
  if (typeof s === "string") return s;
  if (s && typeof s === "object" && "__kind__" in s)
    return toText((s as { __kind__: string }).__kind__);
  return toText(s);
}

export function JobSystemMonitor() {
  const { data: pendingCount, isLoading: pendingLoading } =
    useGetPendingJobCount();
  const { data: deadLetter, isLoading: dlLoading } = useGetDeadLetterJobs();
  const { data: jobLog, isLoading: logLoading } = useGetJobLog();

  const deadJobs = useMemo<Job[]>(
    () => (Array.isArray(deadLetter) ? deadLetter.filter(isJob) : []),
    [deadLetter],
  );
  const logRows = useMemo<JobLogEntry[]>(
    () => (Array.isArray(jobLog) ? jobLog.filter(isJobLog) : []),
    [jobLog],
  );

  return (
    <div className="space-y-5" data-ocid="admin.jobs.section">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CryoStatCard
          label="Pending Jobs"
          value={pendingLoading ? "—" : toBigInt(pendingCount).toLocaleString()}
          icon={Clock}
          marker="admin.jobs.pending"
        />
        <CryoStatCard
          label="Dead Letter Jobs"
          value={dlLoading ? "—" : deadJobs.length.toLocaleString()}
          icon={AlertOctagon}
          marker="admin.jobs.dead_letter_count"
        />
        <CryoStatCard
          label="Log Entries"
          value={logLoading ? "—" : logRows.length.toLocaleString()}
          icon={Activity}
          marker="admin.jobs.log_count"
        />
      </div>

      {/* Dead Letter Queue */}
      <CryoCard
        condensation
        className="p-5 sm:p-6"
        data-ocid="admin.jobs.dead_letter.card"
      >
        <CryoSectionHeader
          title="Dead Letter Queue"
          description="Jobs that exhausted retries and need manual review."
          icon={<AlertOctagon className="h-5 w-5" />}
          marker="admin.jobs.dead_letter.header"
        />
        <div className="mt-5 overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Job
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Kind
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Retries
                </TableHead>
                <TableHead className="pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Last Error
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dlLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <span data-ocid="admin.jobs.dead_letter.loading_state">
                      Inspecting the queue…
                    </span>
                  </TableCell>
                </TableRow>
              ) : deadJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <CryoEmptyState
                      message="Dead letter queue is clear"
                      hint="No jobs have exhausted their retries."
                      marker="admin.jobs.dead_letter.empty_state"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                deadJobs.slice(0, 20).map((job, i) => (
                  <motion.tr
                    key={job.id.toString()}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i * 0.03, 0.4),
                    }}
                    className="border-border/40 transition-colors hover:bg-destructive/5"
                    data-ocid={`admin.jobs.dead_letter.row.${i + 1}`}
                  >
                    <TableCell className="py-3 pl-4 font-mono text-sm tabular-nums text-foreground">
                      #{toBigInt(job.id).toString()}
                    </TableCell>
                    <TableCell className="py-3 font-mono text-xs text-muted-foreground">
                      {toText(job.kind)}
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm tabular-nums text-muted-foreground">
                      {toBigInt(job.retryCount).toString()}
                    </TableCell>
                    <TableCell className="py-3 pr-4 text-xs text-destructive/90">
                      <span className="line-clamp-2 max-w-xs break-words">
                        {toText(job.lastError, "—")}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CryoCard>

      {/* Recent Job Log */}
      <CryoCard
        condensation
        className="p-5 sm:p-6"
        data-ocid="admin.jobs.log.card"
      >
        <CryoSectionHeader
          title="Recent Job Log"
          description="Latest job processing events across the system."
          icon={<Cog className="h-5 w-5" />}
          marker="admin.jobs.log.header"
        />
        <div className="mt-5 overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Job
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Status
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Attempt
                </TableHead>
                <TableHead className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Message
                </TableHead>
                <TableHead className="pr-4 text-right font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <span data-ocid="admin.jobs.log.loading_state">
                      Reading the log…
                    </span>
                  </TableCell>
                </TableRow>
              ) : logRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <CryoEmptyState
                      message="No job log entries"
                      hint="Events appear as the job system processes work."
                      marker="admin.jobs.log.empty_state"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                logRows.slice(0, 30).map((entry, i) => {
                  const status = statusText(entry.status).toLowerCase();
                  return (
                    <motion.tr
                      key={`${entry.jobId.toString()}-${entry.attempt.toString()}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(i * 0.02, 0.4),
                      }}
                      className="border-border/40 transition-colors hover:bg-accent/5"
                      data-ocid={`admin.jobs.log.row.${i + 1}`}
                    >
                      <TableCell className="py-3 pl-4 font-mono text-sm tabular-nums text-foreground">
                        #{toBigInt(entry.jobId).toString()}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`border font-mono text-[10px] uppercase tracking-[0.14em] ${STATUS_TONE[status] ?? STATUS_TONE.pending}`}
                          data-ocid={`admin.jobs.log.status.${i + 1}`}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 font-mono text-sm tabular-nums text-muted-foreground">
                        {toBigInt(entry.attempt).toString()}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">
                        <span className="line-clamp-2 max-w-xs break-words">
                          {toText(entry.message, "—")}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-4 text-right text-xs tabular-nums text-muted-foreground/80">
                        {formatSignupDate(entry.timestamp)}
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CryoCard>
    </div>
  );
}

export default JobSystemMonitor;
