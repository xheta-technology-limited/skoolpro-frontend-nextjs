export type SchoolPlan = {
  key: string;
  name: string;
  description: string;
  module_keys: string[];
  limits: {
    max_students: number;
    max_staff: number;
    max_campuses: number;
    max_admin_accounts: number;
    max_storage_mb: number;
  };
};
