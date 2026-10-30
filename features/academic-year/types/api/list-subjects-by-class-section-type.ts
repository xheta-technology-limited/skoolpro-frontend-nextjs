export type ClassSectionSubject = {
  id: string;
  is_whole_level: boolean;
  class_section_id: string | null;
  is_compulsory: boolean;
  pass_mark: number;
  subject: {
    name: string;
    code: string;
  };
};

export type ClassSectionMeta = {
  total_subject_offered: number;
  compulsory_count: number;
  elective_count: number;
  class_specific_count: number;
};

export type ClassSectionSubjectResponse = {
  data: ClassSectionSubject[];
  meta: ClassSectionMeta;
};
