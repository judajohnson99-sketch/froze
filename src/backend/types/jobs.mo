/// Background job system types — heartbeat-driven, retry, dead-letter queue.
import Common "./common";

module {
  /// Kinds of background jobs the system runs.
  public type JobKind = {
    #autoDeposit;
    #unlockCheck;
    #withdrawalProcess;
    #interestReward;
    #recurringDeposit;
    #milestoneCheck;
    #optimizationRun;
  };

  /// Current state of a job.
  public type JobStatus = {
    #pending;
    #running;
    #succeeded;
    #failed;
    #deadLetter;     // exhausted retries
  };

  /// A background job record.
  public type Job = {
    id : Nat;
    kind : JobKind;
    idempotencyKey : Common.IdempotencyKey;
    /// Payload encoded as text (job-kind-specific).
    payload : Text;
    status : JobStatus;
    retryCount : Nat;
    /// Exponential backoff: next attempt at this timestamp (ns).
    nextAttemptAt : Common.Timestamp;
    createdAt : Common.Timestamp;
    lastError : ?Text;
  };

  /// Append-only job log entry — one per attempt.
  public type JobLogEntry = {
    jobId : Nat;
    attempt : Nat;
    status : JobStatus;
    message : Text;
    timestamp : Common.Timestamp;
  };
};
