export type ApplyMappingPayload = {
  column_mapping: Record<string, string>;
};

export type ImportRow<Mapped extends Record<string, string>> = {
  id: string;
  row_number: number;
  status: string;
  errors: unknown;
  is_duplicate: boolean;
  raw_data: Record<string, string> | null;
  mapped_data: Mapped | null;
};

export type ImportRecord<ColumnMapping extends Record<string, string>> = {
  id: string;
  module: string;
  entity_type: string;
  original_filename: string;
  status: string;
  column_mapping: ColumnMapping;
  total_rows: number | null;
  success_count: number;
  error_count: number;
  skipped_count: number;
  started_at: string | null;
  completed_at: string | null;
  rolled_back_at: string | null;
  rows?: ImportRow<ColumnMapping>[];
  created_at: string;
};

export type ApplyMappingResponse<ColumnMapping extends Record<string, string>> =
  ImportRecord<ColumnMapping> & {
    column_mapping: ColumnMapping;
    rows: ImportRow<ColumnMapping>[];
  };
