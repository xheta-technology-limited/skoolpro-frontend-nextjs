export type GradingSchemeComponent = {
  id: string;
  name: string;
  assessment_type: string;
  code: string | null;
  max_score: number;
  weight: number;
  sequence: number;
};

export type GradingScheme = {
  id: string;
  school_id: string;
  name: string;
  scope_type: string;
  education_level_id: string | null;
  subject_level_assignment_id: string | null;
  academic_term_id: string | null;
  grade_scale_id: string | null;
  weights_total: number;
  weights_override: boolean;
  is_active: boolean;
  components: GradingSchemeComponent[];
};
