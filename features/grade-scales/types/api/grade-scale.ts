export type GradeScaleBand = {
  id: string;
  label: string;
  min_score: number;
  max_score: number;
  grade_point: number;
  description: string | null;
  comment: string | null;
  is_pass: boolean;
  sequence: number;
};

export type GradeScale = {
  id: string;
  school_id: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
  bands: GradeScaleBand[];
  created_at: string;
  updated_at: string;
};
