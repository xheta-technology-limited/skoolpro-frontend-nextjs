export type PromotionRule = {
  scope_type: string;
  id?: string;
  education_stage_id?: string | null;
  education_level_id?: string | null;
  minimum_average?: number | null;
  require_all_compulsory?: boolean | null;
  required_subject_assignment_ids?: string[] | null;
  attendance_requirement?: number | null;
  auto_promote?: boolean | null;
  graduation_minimum_average?: number | null;
  is_active?: boolean | null;
};
