export type EducationLevelStage = {
  id: string;
  name: string;
  slug: string;
  code: string;
  sequence: number;
  is_active: boolean;
};

export type EducationLevel = {
  id: string;
  school_id: string;
  education_stage_id: string;
  name: string;
  slug: string;
  code: string | null;
  global_sequence: number;
  stage_sequence: number;
  typical_entry_age: number;
  is_active: boolean;
  stage: EducationLevelStage;
  created_at: string;
  updated_at: string;
};
