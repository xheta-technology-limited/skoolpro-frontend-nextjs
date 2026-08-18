export const SCHOOL_TYPE_OPTIONS = [
  { label: "Nursery", value: "nursery" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Sixth form", value: "sixth_form" },
  { label: "College", value: "college" },
  { label: "Vocational institution", value: "vocational_institution" },
  { label: "Special education school", value: "special_education_school" },
  { label: "Faith based school", value: "faith_based_school" },
  { label: "Boarding school", value: "boarding_school" },
  { label: "Day school", value: "day_school" },
  { label: "Government school", value: "government_school" },
  { label: "Private school", value: "private_school" },
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
  { label: "Others", value: "others" },
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
