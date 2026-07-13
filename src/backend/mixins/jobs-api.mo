/// Public API surface for the background job system — admin-only reads.
/// The heartbeat (system timer) drives job processing internally.
import List "mo:core/List";
import Queue "mo:core/Queue";
import Set "mo:core/Set";
import Map "mo:core/Map";
import Types "../types/jobs";
import Common "../types/common";
import AuthLib "../lib/auth";
import JobsLib "../lib/jobs";

mixin (
  jobLog : List.List<Types.JobLogEntry>,
  deadLetter : List.List<Types.Job>,
  pending : Queue.Queue<Types.Job>,
  adminAllowlist : Set.Set<Common.UserId>,
) {
  /// Get the append-only job log (admin only).
  public shared ({ caller }) func getJobLog() : async [Types.JobLogEntry] {
    AuthLib.requireAdmin(adminAllowlist, caller);
    JobsLib.listLog(jobLog);
  };

  /// List dead-letter jobs (admin only).
  public shared ({ caller }) func getDeadLetterJobs() : async [Types.Job] {
    AuthLib.requireAdmin(adminAllowlist, caller);
    JobsLib.listDeadLetter(deadLetter);
  };

  /// Get a count of pending jobs (admin only).
  public shared ({ caller }) func getPendingJobCount() : async Nat {
    AuthLib.requireAdmin(adminAllowlist, caller);
    pending.size();
  };
};
