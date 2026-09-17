import type { StudentRecord } from "./student-types";

// Mirrors the `action` -> guarded transition table from the
// /students/{student}/transition endpoint docs. Keep in sync with the
// server if new actions are added.
export type TransitionAction =
  | "graduate"
  | "withdraw"
  | "transfer"
  | "suspend"
  | "reinstate"
  | "deactivate"
  | "expel"
  | "mark-alumni"
  | "mark-deceased";

export interface TransitionStudentPayload {
  action: TransitionAction;
}

// Response is the full student record with the updated
// `student_status`. The `api` client here unwraps the API's outer
// `data` envelope (see GetStudentResponse / useGetStudent, which is
// consumed as a flat object, e.g. `student.first_name`), so this
// type is the flat record too — not wrapped in an extra `data` key.
export type TransitionStudentResponse = StudentRecord;