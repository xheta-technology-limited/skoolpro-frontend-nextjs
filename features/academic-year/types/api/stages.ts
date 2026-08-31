import type { EducationLevel } from "./levels";

export type EducationStage = {
  id: string;
  school_id: string;
  school_type_id: string | null;
  name: string;
  slug: string;
  code: string;
  sequence: number;
  is_active: boolean;
  levels: Omit<EducationLevel, "stage">[];
  created_at: string;
  updated_at: string;
};
