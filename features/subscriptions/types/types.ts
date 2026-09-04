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

export type SubscriptionModule = {
  id: string;
  module_key: string;
  is_active: boolean;
  activated_on: string;
  deactivated_on: string | null;
};

export type Subscription = {
  id: string;
  school_id: string;
  plan: string;
  plan_key: string | null;
  status: string;
  starts_on: string;
  ends_on: string;
  billing_frequency: string;
  payment_status: string;
  billing_contact_name: string | null;
  billing_contact_email: string | null;
  billing_contact_phone: string | null;
  billing_address: string | null;
  purchase_order_reference: string | null;
  tax_identifier: string | null;
  limits: {
    max_students: number;
    max_staff: number;
    max_campuses: number;
    max_admin_accounts: number;
    max_storage_mb: number;
  };
  modules: SubscriptionModule[];
  discounts: unknown[];
  created_at: string;
};

export type ApplyPlanPayload = {
  plan_key: string;
  replace_modules: boolean;
};

export interface ApplyPlanParams {
  subscriptionId: string;
  payload: ApplyPlanPayload;
}