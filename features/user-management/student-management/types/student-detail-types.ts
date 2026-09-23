export interface StudentGuardianLink {
  relationship: string;
  is_primary_contact: boolean;
  is_emergency_contact: boolean;
  is_financially_responsible: boolean;
  authorised_to_collect: boolean;
  receives_academic_reports: boolean;
  receives_medical_info: boolean;
  can_make_decisions: boolean;
  has_portal_access: boolean;
}

export interface StudentGuardian {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  link: StudentGuardianLink;
}

export interface StudentCurrentEnrolment {
  id: string;
  school_id: string;
  student_id: string;
  class_section_id: string;
  academic_year_id: string;
  roll_number: string | null;
  status: string;
  enrolled_on: string;
  class_section: {
    id: string;
    name: string;
    slug: string;
    arm_sequence: number;
    code: string;
    created_at: string;
    updated_at: string;
  };
}

export interface StudentDetail {
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
  current_enrolment: StudentCurrentEnrolment | null;
  guardians: StudentGuardian[];
  created_at: string;
  updated_at: string;
}

// api.get unwraps the {"data": ...} envelope — this hook returns the
// student object directly, not wrapped.
export type GetStudentResponse = StudentDetail;
