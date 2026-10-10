import type { GuardianRecord } from "./guardian-types";

export interface GuardianStudentLink {
  id: string;
  full_name: string;
  admission_number: string;
  link: {
    relationship: string;
    is_primary_contact: boolean;
    is_emergency_contact: boolean;
    is_financially_responsible: boolean;
    authorised_to_collect: boolean;
    receives_academic_reports: boolean;
    receives_medical_info: boolean;
    can_make_decisions: boolean;
    has_portal_access: boolean;
  };
}

export interface GuardianDetail extends GuardianRecord {
  students: GuardianStudentLink[];
}

export type GetGuardianResponse = GuardianDetail;