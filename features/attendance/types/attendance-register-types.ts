// Confirmed: POST /class-sections/{section}/register/{term}.
// The api client auto-unwraps `data`, so the hook returns
// AttendanceSession directly.

// UNCONFIRMED enum: "daily" (the default) and "lesson" are the only
// values the spec mentions. "lesson" needs the timetable module (422
// otherwise).
export type AttendanceSessionType = "daily" | "lesson";

export type AttendanceSource =
  | "manual"
  | "qr"
  | "barcode"
  | "biometric"
  | "rfid"
  | "access_control"
  | "parent_confirmation";

interface RegisterEntryBase {
  enrolment_id: string; // must belong to the class being marked
  arrived_at?: string; // "H:i" or "H:i:s"; used for late calculation
  reason?: string; // required if the status demands it
  document_path?: string; // required if the status demands it
  is_absent?: boolean;
  source?: AttendanceSource; // defaults to "manual"
}

// Each entry identifies its status by code OR by id — one of the two
// is required.
export type RegisterEntry = RegisterEntryBase &
  (
    | { status_code: string; attendance_status_id?: never }
    | { attendance_status_id: string; status_code?: never }
  );

export interface MarkRegisterPayload {
  date: string; // session date, "YYYY-MM-DD"
  type?: AttendanceSessionType; // defaults to "daily"
  subject_level_assignment_id?: string; // for a "lesson" session
  label?: string; // e.g. "Morning roll call"
  entries: RegisterEntry[]; // one per student
}

export interface AttendanceRecord {
  id: string;
  enrolment_id: string;
  attendance_status_id: string;
  status_code: string;
  arrived_at: string | null;
  reason: string | null;
  document_path: string | null;
  source: AttendanceSource;
}

export interface AttendanceSession {
  id: string;
  class_section_id: string;
  academic_term_id: string;
  session_date: string;
  session_type: AttendanceSessionType;
  subject_level_assignment_id: string | null;
  label: string | null;
  records: AttendanceRecord[];
  taken_at: string;
}

// GET /class-sections/{section}/register/{term}?date=&type=
// Both params are optional in the spec. `type` is typed with
// AttendanceSessionType (see the unconfirmed-enum note above).
export type GetRegisterParams = {
  date?: string; // "YYYY-MM-DD"
  type?: AttendanceSessionType;
}

// With nothing marked for that date/type, the server returns
// { data: null } with a message instead of an error.
export interface GetRegisterResponse {
  data: AttendanceSession | null;
  message?: string;
}

// POST /attendance-records/{record}/approve — an audited status change
// that swaps a record to an authorised status (e.g. unauthorised
// absence -> authorised leave), recording who did it.
export interface ApproveAbsencePayload {
  attendance_status_id: string; // must be an `is_authorised` status
  reason?: string;
  document_path?: string;
}