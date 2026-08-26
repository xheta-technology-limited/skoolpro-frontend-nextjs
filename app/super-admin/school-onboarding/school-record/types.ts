import type { SchoolProfile } from "@/features/school-profile/types/school-profile";

export interface SchoolLicenseFile {
  name: string;
  sizeLabel: string;
  url: string;
}

export type Contact = SchoolProfile["contacts"][number];

export type Campus = SchoolProfile["campuses"][number];

export type RegistrationNumber =
  SchoolProfile["registration_numbers"][number];

export type SchoolType = SchoolProfile["types"][number];

export type UpdateSchoolProfilePayload = {
  registered_name?: string;
  display_name?: string;
  ownership_type?: string;
  founding_date?: string;
  description?: string;
  motto?: string;
  type_slugs?: string[];
};

export type UpdateCampusPayload = {
  name?: string;
  address_line_1?: string;
  country_code?: string;
};

export type UpdateRegistrationNumberPayload = {
  country_code?: string;
  number?: string;
  issuing_authority?: string;
  expiry_date?: string | null;
};