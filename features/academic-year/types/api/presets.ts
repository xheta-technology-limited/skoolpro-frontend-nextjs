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
