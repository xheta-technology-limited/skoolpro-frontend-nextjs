import type { StudentRecord } from "../../student-management/types/student-types";
import type { StudentGuardian } from "../../student-management/types/student-detail-types";

export interface GetStudentGuardiansResponse extends StudentRecord {
  guardians: StudentGuardian[];
}