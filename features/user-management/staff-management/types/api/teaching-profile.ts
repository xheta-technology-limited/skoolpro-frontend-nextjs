export interface TeacherProfile {
  id: string;
  staff_id: string;
  teacher_registration_number: string | null;
  form_class_section_id: string | null;
  max_teaching_load: number | null;
  specialist_skills: string | null;
  curriculum_experience: string | null;
  subject_ids: string[];
  section_ids: string[];
}
