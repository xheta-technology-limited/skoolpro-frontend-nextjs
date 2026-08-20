export type BeginOnboardingResponse = {
  id: string;
  reference_number: string;
  school_id: string;
  school: {
    id: string;
    registered_name: string;
    display_name: string;
    ownership_type: string;
    founding_date: string;
    motto: string;
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
      student_capacity: number;
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
    }[];
  };
  priority: string;
  target_go_live_date: string;
  progress_percentage: number;
  current_status: {
    id: string;
    name: string;
    slug: string;
    sequence_order: number;
    is_terminal: boolean;
    color: string;
    is_active: boolean;
  };
  created_at: string;
  updated_at: string;
};

export type BeginOnboardingRequest = {
  school: {
    registered_name: string;
    display_name: string;
    ownership_type: string;
    founding_date: string;
    description: string;
    education_authorities: string[];
    motto: string;
    primary_color: string;
    secondary_color: string;
  };

  type_slugs: string[];

  campuses: {
    name: string;
    is_primary: boolean;
    address_line_1: string;
    city: string;
    state_province: string;
    country_code: string;
    timezone: string;
    student_capacity: number;
  }[];

  registration_numbers: {
    country_code: string;
    number: string;
    issuing_authority: string;
  }[];

  contacts: {
    type: string;
    label: string;
    value: string;
    is_primary: boolean;
  }[];

  key_contacts: {
    role_type: string;
    full_name: string;
    job_title: string;
    email: string;
    phone: string;
  }[];

  onboarding: {
    priority: string;
    target_go_live_date: string;
  };
};
