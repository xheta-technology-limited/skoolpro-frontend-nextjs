// Confirmed against the real GET /education/levels sample response.
export interface EducationStage {
  id: string;
  school_id?: string;
  school_type_id?: string | null;
  name: string;
  slug: string;
  code: string;
  sequence: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EducationLevelRecord {
  id: string;
  school_id: string;
  education_stage_id: string;
  name: string;
  slug: string;
  code: string | null;
  global_sequence: number;
  stage_sequence: number;
  typical_entry_age: number;
  is_active: boolean;
  stage: EducationStage;
  created_at: string;
  updated_at: string;
}

// The raw HTTP body is { "data": [...] }. Assuming api.get unwraps
// that the same way it does for GetStudentsResponse (confirmed there
// via runtime logging) — verify this one the same way before relying
// on it.
export type GetEducationLevelsResponse = EducationLevelRecord[];