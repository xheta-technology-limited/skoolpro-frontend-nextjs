export type EducationArmLevel = {
  id: string;
  name: string;
  slug: string;
  global_sequence: number;
};

export type EducationArm = {
  id: string;
  school_id: string;
  education_level_id: string;
  campus_id: string | null;
  uses_primary_campus: boolean;
  staff_id: string;
  name: string;
  slug: string;
  code: string;
  arm_sequence: number;
  capacity: number;
  is_active: boolean;
  level: EducationArmLevel;
  created_at: string;
  updated_at: string;
};
