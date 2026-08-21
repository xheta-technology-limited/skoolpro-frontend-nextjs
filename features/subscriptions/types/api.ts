export type CreateSubscriptionRequest = {
  plan_key: string;
  status: string;
  starts_on: string;
  ends_on: string;
  billing_frequency: string;
  billing_contact_name: string;
  billing_contact_email: string;
};

export interface CreateSubscriptionParams {
  schoolId: string;
  payload: CreateSubscriptionRequest;
}

export interface CreateSubscriptionResponse {
  id: string;
  school_id: string;
  plan: string;
  plan_key: string;
  status: string;
  starts_on: string;
  ends_on: string;
  billing_frequency: string;
  payment_status: string;
  billing_contact_name: string;
  billing_contact_email: string;
  limits: {
    max_students: number;
    max_staff: number;
    max_campuses: number;
    max_admin_accounts: number;
    max_storage_mb: number;
  };
  modules: {
    id: string;
    module_key: string;
    is_active: boolean;
    activated_on: string;
    deactivated_on: string | null;
  }[];
  discounts: unknown[];
  created_at: string;
}
