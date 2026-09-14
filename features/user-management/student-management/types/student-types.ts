export interface StudentRecord {
  id: string;
  school_id: string;
  user_id: string | null;
  has_login: boolean;
  student_id_number: string | null;
  admission_number: string;
  previous_admission_number: string | null;
  national_student_number: string | null;
  boarding_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  preferred_name: string | null;
  former_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  photo_path: string | null;
  nationality: string | null;
  country_of_birth: string | null;
  place_of_birth: string | null;
  first_language: string | null;
  other_languages: string | null;
  religion: string | null;
  ethnicity: string | null;
  personal_email: string | null;
  personal_phone: string | null;
  home_address: string | null;
  mailing_address: string | null;
  current_residential_address: string | null;
  admission_date: string;
  entry_academic_year_id: string | null;
  entry_term_id: string | null;
  entry_level_id: string | null;
  admission_type: string | null;
  previous_school: string | null;
  reason_for_leaving_previous_school: string | null;
  entrance_exam_result: string | null;
  interview_result: string | null;
  admission_status: string;
  student_status: string;
  created_at: string;
  updated_at: string;
}

export interface GetStudentsParams {
  status?: string;
  admission_status?: string;
  search?: string;
  // Index signature so this stays structurally compatible with
  // api.get's params argument (Record<string, string | number |
  // boolean | null | undefined>) without needing a cast at the call
  // site. Add new query params above as named, typed properties —
  // this signature is just to satisfy api.get's generic shape.
  [key: string]: string | number | boolean | null | undefined;
}

// api.get already unwraps the {"data": [...]} envelope the raw HTTP
// response uses — confirmed via runtime logging, the array itself is
// what actually comes back, not a wrapper object. Don't re-add a
// `data` property here or callers will look for response.data.data
// and get undefined.
export type GetStudentsResponse = StudentRecord[];