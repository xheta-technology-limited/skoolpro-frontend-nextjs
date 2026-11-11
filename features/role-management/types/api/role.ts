export type Role = {
  id: number;
  name: string;
  label: string;
  is_protected: boolean;
  is_active: boolean;
  disabled_at: string | null;
  permissions_count: number;
  users_count: number;
  created_at: string;
  updated_at: string;
};
