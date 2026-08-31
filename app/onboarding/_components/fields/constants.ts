export const SCHOOL_TYPE_OPTIONS = [
  { label: "Nursery", value: "nursery" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Sixth form", value: "sixth-form" },
  { label: "College", value: "college" },
  { label: "Vocational institution", value: "vocational" },
  { label: "Special education school", value: "special-education" },
  { label: "Faith based school", value: "faith-based" },
  { label: "International", value: "international"},
  { label: "Boarding school", value: "boarding" },
  { label: "Day school", value: "day" },
  { label: "Mixed day/boarding", value: "mixed-dayboarding"},
  { label: "Government school", value: "government" },
  { label: "Private school", value: "private" },
  { label: "Other", value: "other"},
];

export const OWNERSHIP_TYPE_OPTIONS = [
  { label: "Private individual", value: "private_individual" },
  { label: "Limited company", value: "limited_company" },
  { label: "Trust", value: "trust" },
  { label: "Charity", value: "charity" },
  { label: "Religious organization", value: "religious_organization" },
  { label: "Government", value: "government" },
  { label: "Community organization", value: "community_organization" },
  { label: "Partnership", value: "partnership" },
  { label: "Other", value: "other" },
];

export const CONTACT_TYPE_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "Phone number", value: "phone" },
  { label: "Social media", value: "social_media" },
  { label: "Website", value: "website" },
];

export const ROLE_TYPE_OPTIONS = [
  { label: "Primary contact", value: "primary_contact" },
  { label: "Project lead", value: "project_lead" },
  { label: "Executive sponsor", value: "executive_sponsor" },
  { label: "Technical contact", value: "technical_contact" },
  { label: "Finance contact", value: "finance_contact" },
  { label: "Academic contact", value: "academic_contact" },
];

export const PRIORITY_LEVEL_OPTIONS = [
  { label: "Standard", value: "standard" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
  { label: "Strategic client", value: "strategic_client" },
];

export const emptyRegistration = {
  country_code: "",
  number: "",
  issuing_authority: "",
};

export const emptyCampus = {
  name: "",
  is_primary: false,
  address_line_1: "",
  city: "",
  state_province: "",
  country_code: "",
  timezone: "",
  student_capacity: "",
};

export const emptyContact = {
  type: "",
  label: "",
  value: "",
  is_primary: false,
};

export const emptyKeyContact = {
  role_type: "",
  full_name: "",
  job_title: "",
  email: "",
  phone: "",
};
