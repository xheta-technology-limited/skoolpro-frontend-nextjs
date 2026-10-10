import type { StudentRecord } from "../../student-management/types/student-types";
import type { StudentGuardian } from "../../student-management/types/student-detail-types";

export interface AttachGuardianPayload {
  guardian_id: string;
  relationship: string;
  is_primary_contact?: boolean;
  is_emergency_contact?: boolean;
  is_financially_responsible?: boolean;
  authorised_to_collect?: boolean;
  receives_academic_reports?: boolean;
  receives_medical_info?: boolean;
  can_make_decisions?: boolean;
  has_portal_access?: boolean;
}

export interface AttachGuardianResponse extends StudentRecord {
  guardians: StudentGuardian[];
}