export interface EnrolmentRecord {
  id: string;
  school_id: string;
  student_id: string;
  class_section_id: string;
  academic_year_id: string;
  roll_number: string | null;
  status: string;
  enrolled_on: string;
  student: {
    id: string;
    full_name: string;
    admission_number: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GetEnrolmentsParams {
  student_id?: string;
  class_section_id?: string;
  academic_year_id?: string;
  status?: string;
  // Index signature so this stays structurally compatible with
  // api.get's params argument, matching the same pattern used in
  // GetStudentsParams.
  [key: string]: string | number | boolean | null | undefined;
}

// Assumes the same {"data": [...]} -> flat-array unwrapping api.get
// does elsewhere (confirmed for GetStudentsResponse) — verify before
// relying on it if anything comes back as undefined.
export type GetEnrolmentsResponse = EnrolmentRecord[];