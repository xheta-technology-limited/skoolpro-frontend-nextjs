export type PassMark = {
  id: string;
  scope_type: string;
  education_stage_id: string | null;
  class_section_id: string | null;
  applies_to: string;
  pass_mark: number;
};
