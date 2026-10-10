import type { GuardianRecord } from "./guardian-types";

export interface CreateGuardianPayload {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  middle_name?: string;
  gender?: string;
  occupation?: string;
  employer?: string;
  nationality?: string;
  alt_phone?: string;
  home_address?: string;
  work_address?: string;
  preferred_language?: string;
  preferred_contact_method?: string;
  user_id?: string;
}

export type CreateGuardianResponse = GuardianRecord;