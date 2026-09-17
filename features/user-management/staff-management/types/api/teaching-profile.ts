export interface TeacherProfile {
  id: string;
  staff_id: string;
  teacher_registration_number: string | null;
  form_class_section_id: string | null;
  max_teaching_load: number | null;
  specialist_skills: string | null;
  curriculum_experience: string | null;
}

export interface TeacherProfileResponse {
  profile: TeacherProfile;
  subjects: Subject[];
  sections: Section[];
}

export interface Subject {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  name: string;
  code: string;
}

export interface UpdateTeachingProfileData {
  teacher_registration_number: string | undefined;
  form_class_section_id: string | undefined;
  max_teaching_load: number | undefined;
  specialist_skills: string | undefined;
  curriculum_experience: string | undefined;
  subjects: Subject[];
  sections: Section[];
}
