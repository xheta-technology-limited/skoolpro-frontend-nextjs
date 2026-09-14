export type StaffCategory = string;

export type EmploymentType = string;

export type StaffStatus = "active" | "inactive";

export type WorkingDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Staff {
  id: string;
  school_id: string;
  user_id: string;
  staff_number: string;
  payroll_number: string | null;
  national_reg_number: string | null;
  title: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  full_name: string;
  gender: string;
  date_of_birth: string | null; // ISO date (YYYY-MM-DD)
  nationality: string | null;
  photo_path: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  category: StaffCategory;
  department: string | null;
  reporting_manager_id: string | null;
  campus_id: string | null;
  work_location: string | null;
  employment_type: EmploymentType;
  contract_type: string | null;
  employment_start_date: string | null; // ISO date (YYYY-MM-DD)
  probation_end_date: string | null; // ISO date (YYYY-MM-DD)
  contract_end_date: string | null; // ISO date (YYYY-MM-DD)
  working_days: WorkingDay[] | null;
  working_hours: string | null;
  staff_status: StaffStatus;
  teaching_profile: Record<string, unknown> | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}
