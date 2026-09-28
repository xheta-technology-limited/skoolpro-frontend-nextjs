export type ImportColumnMapping = {
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
};

export type ApplyMappingPayload = {
  column_mapping: Record<string, string>;
};

type MappedData = {
  email: string;
  phone: string;
  title: string;
  gender: string;
  category: string;
  last_name: string;
  department: string;
  first_name: string;
  middle_name: string;
  staff_number: string;
  staff_status: string;
  payroll_number: string;
  employment_type: string;
  national_reg_number: string;
  employment_start_date: string;
};

export type ImportRow = {
  id: string;
  row_number: number;
  status: string;
  errors: unknown;
  is_duplicate: boolean;
  raw_data: MappedData | null;
  mapped_data: MappedData | null;
};

export type ImportRecord = {
  id: string;
  module: string;
  entity_type: string;
  original_filename: string;
  status: string;
  column_mapping: Record<string, string>;
  total_rows: number | null;
  success_count: number;
  error_count: number;
  skipped_count: number;
  started_at: string | null;
  completed_at: string | null;
  rolled_back_at: string | null;
  rows?: ImportRow[];
  created_at: string;
};

export type ApplyMappingResponse = ImportRecord & {
  column_mapping: ImportColumnMapping;
  rows: ImportRow[];
};
