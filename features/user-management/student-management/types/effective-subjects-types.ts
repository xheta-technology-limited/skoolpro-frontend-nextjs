export type EffectiveSubjectSource = "compulsory" | "optional";

export interface EffectiveSubjectRecord {
  assignment_id: string;
  subject_id: string;
  subject_name: string;
  education_level_id: string;
  // null = whole-level assignment; a value = arm-specific.
  class_section_id: string | null;
  is_compulsory: boolean;
  pass_mark: number;
  source: EffectiveSubjectSource;
}

// The doc's own generic '200' schema block is inconsistent with its
// worked JSON example (schema says `data: string[]`, the example
// shows an array of the objects above) — trusting the worked example,
// same as with other endpoints in this codebase, since the generic
// schema block looks like an unedited placeholder.
export type GetEffectiveSubjectsResponse = EffectiveSubjectRecord[];