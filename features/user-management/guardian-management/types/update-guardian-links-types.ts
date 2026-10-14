
export interface UpdateGuardianLinkPayload {
  relationship?: string;
  is_emergency_contact?: boolean;
  is_financially_responsible?: boolean;
  authorised_to_collect?: boolean;
  receives_academic_reports?: boolean;
  receives_medical_info?: boolean;
  can_make_decisions?: boolean;
  has_portal_access?: boolean;
}