// Confirmed against the real GET /class-sections sample response.
export interface ClassSectionRecord {
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
}

// The raw HTTP body is { "data": [...] }. Assuming api.get unwraps
// that the same way it does for GetStudentsResponse (confirmed there
// via runtime logging) — verify this one the same way before relying
// on it; if it comes back still wrapped, this type is wrong and
// callers will get undefined.
export type GetClassSectionsResponse = ClassSectionRecord[];