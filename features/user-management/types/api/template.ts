export type StartImportPayload = {
  file: File;
  module: string;
  entity_type: string;
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
  created_at: string;
};
