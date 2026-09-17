export interface CreateEnrolmentPayload {
  student_id: string;
  class_section_id: string;
  academic_year_id: string;
  roll_number?: string;
}

export interface CreateEnrolmentResponse {
  data: {
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
  };
  // Only present on create/transfer (a per-write result, per the
  // endpoint docs) — absent on reads. Section capacity is a soft
  // cap: enrolling past it still succeeds (201) with this flag true,
  // it's not an error. The hard block (subscription max_students
  // limit) is a 422 instead and never reaches this meta at all.
  meta?: {
    over_capacity: boolean;
  };
}