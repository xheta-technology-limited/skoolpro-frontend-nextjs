// Confirmed: GET /class-sections/{section}/attendance/{term} — an
// object keyed by enrolment_id, one summary per student. The api
// client unwraps `data`, so the hook returns ClassAttendanceSummary
// directly.
//
// `attendance_rate` is a formatted STRING with a percent sign
// ("93.33%"), not a number — parse it (parseFloat) before comparing it
// against the rule thresholds or sorting by it.
//
// Only the fields in the spec example are listed. There's no separate
// "excused" count, so excused sessions presumably fall under one of
// these; check against real data if that matters.
export interface StudentAttendanceSummary {
  total_sessions: number;
  present: number;
  absent: number;
  late: number;
  attendance_rate: string;
}

// Keyed by enrolment_id.
export type ClassAttendanceSummary = Record<string, StudentAttendanceSummary>;

// ---------------------------------------------------------------------
// Single-student summary
// ---------------------------------------------------------------------
// Confirmed: GET /enrolments/{enrolment}/attendance/{term}?from=&to=.
// The api client unwraps `data`, so the hook returns this object
// directly.
//
// NOTE: this does NOT match the per-student entries in the class
// summary above, even though that spec says "as in Student Attendance
// Summary": here the counts are `sessions` and a numeric `percent`
// (90.0), there they're `total_sessions` and a string
// `attendance_rate` ("93.33%"), and there's no `excused` or breakdown
// there. One of the two examples is probably out of date — check a
// real class-summary response before building on its shape.
import type { AttendanceStatusCategory } from "./attendance-status-types";

export interface EnrolmentAttendanceSummary {
  sessions: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  authorised_absences: number;
  unauthorised_absences: number;
  percent: number; // a number here, e.g. 90.0
  // Counts per category. Typed Partial in case categories with zero
  // sessions are left out.
  by_category: Partial<Record<AttendanceStatusCategory, number>>;
  // Counts per status code ("P", "L", "UA"...). Keys are the school's
  // own status codes, so they can't be a fixed union.
  by_status: Record<string, number>;
}

// `from` / `to` optionally narrow to a date range within the term.
export type GetEnrolmentAttendanceParams = {
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
}