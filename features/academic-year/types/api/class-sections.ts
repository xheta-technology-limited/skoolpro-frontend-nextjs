export type ClassSection = {
  id: string;
  school_id: string;
  education_level_id: string;
  campus_id: string | null;
  uses_primary_campus: boolean;
  staff_id: string | null;
  name: string;
  slug: string;
  code: string;
  arm_sequence: number;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};