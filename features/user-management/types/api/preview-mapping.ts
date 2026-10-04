export type StaffExpectedColumns = {
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

export type PreviewMappingResponse<
  ExpectedColumns extends Record<string, string> = StaffExpectedColumns
> = {
  file_headers: (keyof ExpectedColumns & string)[];
  expected_columns: ExpectedColumns;
};
