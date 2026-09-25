export type StartImportPayload = {
  file: File;
  module: string;
  entity_type: string;
};

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
  column_mapping: ImportColumnMapping;
};

export type ImportRow = {
  id: string;
  row_number: number;
  status: string;
  errors: unknown;
  is_duplicate: boolean;
  raw_data: Record<string, string | null>;
  mapped_data: Record<string, string | null>;
};

export type ImportRecord = {
  id: string;
  module: string;
  entity_type: string;
  original_filename: string;
  status: string;
  column_mapping: unknown;
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
