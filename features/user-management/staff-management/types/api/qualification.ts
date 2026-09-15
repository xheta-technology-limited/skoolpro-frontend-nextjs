export interface StaffQualification {
  id: string;
  staff_id: string;
  type: string;
  qualification: string;
  institution: string | null;
  award_date: string | null; // ISO date (YYYY-MM-DD)
  grade: string | null;
  professional_registration: string | null;
  expiry_date: string | null; // ISO date (YYYY-MM-DD)
  is_expired: boolean | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}
