export type Department = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  is_active: boolean;
  head_staff_id: string | null;
  subjects_count: number;
  staff_count: number;
  created_at: string;
  updated_at: string;
};
