export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  preferred_name?: string;
  former_name?: string;
  gender?: string;
  nationality?: string;
  country_of_birth?: string;
  place_of_birth?: string;
  first_language?: string;
  other_languages?: string;
  date_of_birth?: string;
  religion?: string;
  ethnicity?: string;
  personal_email?: string;
  personal_phone?: string;
  home_address?: string;
  mailing_address?: string;
  current_residential_address?: string;
  admission_number?: string;
  student_id_number?: string;
  previous_admission_number?: string;
  national_student_number?: string;
  boarding_number?: string;
  admission_date?: string;
  admission_type?: string;
  previous_school?: string;
  reason_for_leaving_previous_school?: string;
  entrance_exam_result?: string;
  interview_result?: string;
  admission_status?: string;
  student_status?: string;
  // Enrolment: required_with each other — sending one without the
  // other is a 422. Omit both entirely for an admit-only student.
  class_section_id?: string;
  academic_year_id?: string;
  roll_number?: string;
}

export interface CreateStudentResponseData {
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
  guardians: unknown[];
  created_at: string;
  updated_at: string;
}

// meta is only present when class_section_id/academic_year_id were
// sent (i.e. admit & enroll, not admit-only).
export interface CreateStudentMeta {
  enrolled: boolean;
  enrolment_id: string;
  over_capacity: boolean;
}

export interface CreateStudentResponse {
  data: CreateStudentResponseData;
  meta?: CreateStudentMeta;
}