// Confirmed: GET /attendance-statuses and POST /attendance-statuses.
// The api client auto-unwraps `data`, so hooks return these shapes
// directly.
export type AttendanceStatusCategory =
  | "present"
  | "absent"
  | "late"
  | "excused";

export interface AttendanceStatus {
  id: string;
  name: string;
  code: string;
  colour: string;
  category: AttendanceStatusCategory;
  counts_as_present: boolean;
  is_authorised: boolean;
  requires_reason: boolean;
  requires_document: boolean;
  is_active: boolean;
  sequence: number;
}

// POST /attendance-statuses. `code` is at most 8 characters and unique
// per school (422 otherwise). A status that requires a document must
// also require a reason (422 otherwise). The omitted fields are set by
// the server (is_active, sequence) or default on its side.
export interface CreateAttendanceStatusPayload {
  name: string;
  code: string;
  category: AttendanceStatusCategory;
  colour?: string; // hex
  counts_as_present?: boolean;
  is_authorised?: boolean;
  requires_reason?: boolean;
  requires_document?: boolean;
}

// PUT /attendance-statuses/{status} — the spec says it uses the same
// fields as create, so the payload type is shared. A PUT may also
// expect the required fields (name, code, category) every time.
export type UpdateAttendanceStatusPayload = CreateAttendanceStatusPayload;