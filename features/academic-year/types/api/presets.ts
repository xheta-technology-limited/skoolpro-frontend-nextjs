export type EducationPresetLevel = {
  name: string;
  code: string;
  typical_entry_age: number;
};

export type EducationPresetStage = {
  name: string;
  code: string;
  school_type_slug: string;
  levels: EducationPresetLevel[];
};

export type EducationPreset = {
  key: string;
  label: string;
  stages: EducationPresetStage[];
};

export type ApplyEducationPresetLevel = {
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
  created_at: string;
  updated_at: string;
};

export type ApplyEducationPresetResponse = {
  id: string;
  school_id: string;
  school_type_id: string;
  name: string;
  slug: string;
  code: string;
  sequence: number;
  is_active: boolean;
  levels: ApplyEducationPresetLevel[];
  created_at: string;
  updated_at: string;
};
