// Confirmed: GET /attendance-rules. The response is a plain
// { data: [...] } list (no pagination meta), which the api client
// unwraps, so the hook returns AttendanceRule[] directly.
//
// UNCONFIRMED: `scope_type` on the response. Create takes
// `scope: "school" | "level"`, but only "school" has been seen coming
// back as `scope_type`, so it stays a plain string. Fields other than
// `education_level_id` are typed non-null as in the examples; loosen any
// that the server turns out to leave null.
export type AttendanceNotifyChannel = "sms" | "email" | "push" | "in_app";

export interface AttendanceRule {
  id: string;
  scope_type: string;
  education_level_id: string | null; // null for a school-wide rule
  late_after: string; // "HH:mm:ss"
  grace_minutes: number;
  late_count_threshold: number;
  absence_notify_after: number;
  absence_requires_evidence: boolean;
  absence_escalate_after: number;
  attendance_percent_warn: number;
  attendance_percent_critical: number;
  notify_channels: AttendanceNotifyChannel[];
  is_active: boolean;
}

// POST /attendance-rules — upserts per scope, so it both creates and
// updates the rule for a scope. Every setting is optional.
//   - 422 if a percentage is outside 0–100.
//   - 422 if attendance_percent_critical is above attendance_percent_warn.
interface SetAttendanceRuleSettings {
  late_after?: string; // arrival past this time = late, "HH:mm" / "HH:mm:ss"
  grace_minutes?: number; // grace before "late" applies
  late_count_threshold?: number; // lateness occurrences -> intervention
  absence_notify_after?: number; // absence streak before notifying
  absence_requires_evidence?: boolean;
  absence_escalate_after?: number; // absence streak before escalation
  attendance_percent_warn?: number; // % that triggers a warning
  attendance_percent_critical?: number; // % that triggers escalation
  notify_channels?: AttendanceNotifyChannel[];
}

// `education_level_id` is required when scope is "level" and not used
// for a school-wide rule.
export type SetAttendanceRulePayload = SetAttendanceRuleSettings &
  (
    | { scope: "school"; education_level_id?: never }
    | { scope: "level"; education_level_id: string }
  );