export type GradeScaleBand = {
  label: string;
  min_score: number;
  max_score: number;
  grade_point?: number;
  description?: string;
  comment?: string;
  is_pass?: boolean;
};

export type GradeScale = {
  name: string;
  is_default: boolean;
  bands: GradeScaleBand[];
};