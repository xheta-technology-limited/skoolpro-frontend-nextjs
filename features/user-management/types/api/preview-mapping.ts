type StaffFileHeaders =
  | "staff_number"
  | "first_name"
  | "last_name"
  | "category"
  | "middle_name"
  | "title"
  | "gender"
  | "email"
  | "phone"
  | "department"
  | "employment_type"
  | "employment_start_date"
  | "staff_status"
  | "payroll_number"
  | "national_reg_number";

export interface StaffExpectedColumns {
  staff_number: string;
  first_name: string;
  last_name: string;
  category: string;
  middle_name: string;
  title: string;
  gender: string;
  email: string;
  phone: string;
  department: string;
  employment_type: string;
  employment_start_date: string;
  staff_status: string;
  payroll_number: string;
  national_reg_number: string;
}

export interface PreviewMappingResponse {
  file_headers: StaffFileHeaders[];
  expected_columns: StaffExpectedColumns;
}
