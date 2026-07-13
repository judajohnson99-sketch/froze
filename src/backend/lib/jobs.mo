/// Background job system — heartbeat, retry, dead-letter queue, append-only log.
import Map "mo:core/Map";
import Queue "mo:core/Queue";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/jobs";
import Common "../types/common";

module {
  public type Job = Types.Job;
  public type JobLogEntry = Types.JobLogEntry;

  /// Maximum retries before a job is moved to the dead-letter queue.
  let maxRetries : Nat = 5;

  /// Base backoff in nanoseconds (1 second). Unused at present; reserved for
  /// future jittered-backoff tuning.
  let _baseBackoffNs : Int = 1_000_000_000;

  /// Enqueue a new job. Traps if the idempotency key is already in use.
  public func enqueue(
    pending : Queue.Queue<Job>,
    jobIndex : Map.Map<Common.IdempotencyKey, Nat>,
    nextJobId : { var value : Nat },
    kind : Types.JobKind,
    idempotencyKey : Common.IdempotencyKey,
    payload : Text,
    timestamp : Common.Timestamp,
  ) : Nat {
    if (jobIndex.containsKey(idempotencyKey)) {
      Runtime.trap("jobs.enqueue: duplicate idempotency key");
    };
    let id = nextJobId.value;
    nextJobId.value := id + 1;
    let job : Job = {
      id;
      kind;
      idempotencyKey;
      payload;
      status = #pending;
      retryCount = 0;
      nextAttemptAt = timestamp;
      createdAt = timestamp;
      lastError = null;
    };
    pending.pushBack(job);
    jobIndex.add(idempotencyKey, id);
    id;
  };

  /// Pop the next due job (nextAttemptAt <= now). Returns null if none due.
  public func popDue(
    pending : Queue.Queue<Job>,
    now : Common.Timestamp,
  ) : (?Job, Queue.Queue<Job>) {
    switch (pending.popFront()) {
      case (?job) {
        if (Int_le(job.nextAttemptAt, now)) {
          (?job, pending);
        } else {
          // Not due yet — put it back at the front and signal none due.
          let restored = Queue.empty<Job>();
          restored.pushBack(job);
          let _ = Queue_toFront(restored, pending);
          (null, restored);
        };
      };
      case null { (null, pending) };
    };
  };

  /// Record a job attempt outcome in the append-only log and update job state.
  public func recordAttempt(
    jobLog : List.List<JobLogEntry>,
    job : Job,
    status : Types.JobStatus,
    message : Text,
    timestamp : Common.Timestamp,
  ) : Job {
    let attempt = job.retryCount + 1;
    let entry : JobLogEntry = {
      jobId = job.id;
      attempt;
      status;
      message;
      timestamp;
    };
    jobLog.add(entry);
    { job with status; retryCount = attempt; lastError = ?message };
  };

  /// Compute the next attempt timestamp using exponential backoff.
  /// base * 2^retryCount nanoseconds from now.
  public func nextAttemptWithBackoff(
    retryCount : Nat,
    base : Common.Timestamp,
    now : Common.Timestamp,
  ) : Common.Timestamp {
    let multiplier = Nat_pow(2, retryCount);
    let backoff = base * multiplier;
    now + backoff;
  };

  /// Move a job to the dead-letter queue after exhausting retries.
  public func moveToDeadLetter(
    deadLetter : List.List<Job>,
    job : Job,
  ) : () {
    let dead : Job = { job with status = #deadLetter };
    deadLetter.add(dead);
  };

  /// List the append-only job log (admin only).
  public func listLog(jobLog : List.List<JobLogEntry>) : [JobLogEntry] {
    jobLog.toArray();
  };

  /// List dead-letter jobs (admin only).
  public func listDeadLetter(deadLetter : List.List<Job>) : [Job] {
    deadLetter.toArray();
  };

  /// Whether a job has exhausted its retries.
  public func isExhausted(job : Job) : Bool {
    job.retryCount >= maxRetries;
  };

  // ── Local helpers (no external Nat.pow / Queue.pushFront wrapper) ───────
  func Int_le(a : Int, b : Int) : Bool { a <= b };

  func Nat_pow(base : Nat, exp : Nat) : Nat {
    var result : Nat = 1;
    var i : Nat = 0;
    while (i < exp) {
      result *= base;
      i += 1;
    };
    result;
  };

  // Push all elements of `src` to the front of `dst` preserving order.
  // Returns the count pushed (unused by callers).
  func Queue_toFront<T>(dst : Queue.Queue<T>, src : Queue.Queue<T>) : Nat {
    var count = 0;
    for (v in src.values()) {
      dst.pushFront(v);
      count += 1;
    };
    count;
  };
};
