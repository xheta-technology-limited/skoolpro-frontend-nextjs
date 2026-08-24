export type SchoolProfile = {
  id: string;
  registered_name: string;
  display_name: string;
  ownership_type: string;
  founding_date: string;
  description: string;
  education_authorities: string[];
  motto: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string | null;
  text_color: string | null;
  letterhead_notes: string | null;
  types: {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
  }[];
  campuses: {
    id: string;
    name: string;
    is_primary: boolean;
    city: string;
    country_code: string;
    opening_status: string;
  }[];
  registration_numbers: {
    id: string;
    country_code: string;
    number: string;
    issuing_authority: string;
    expiry_date: string | null;
  }[];
  contacts: {
    id: string;
    type: string;
    label: string;
    value: string;
    is_primary: boolean;
  }[];
  key_contacts: {
    id: string;
    role_type: string;
    full_name: string;
    job_title: string;
    email: string;
    phone: string | null;
    has_decision_making_authority: boolean;
  }[];
  authorised_signatories: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    job_title: string;
  }[];
  created_at: string;
  updated_at: string;
};
