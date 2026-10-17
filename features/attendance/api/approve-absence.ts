import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  ApproveAbsencePayload,
  AttendanceRecord,
} from "../types/attendance-register-types";

interface ApproveAbsenceArgs {
  recordId: string;
  payload: ApproveAbsencePayload;
}

// Confirmed: POST /attendance-records/{record}/approve (200). 422: the
// chosen status isn't an authorised one, or belongs to another school.
//
// Response shape is UNCONFIRMED — the spec says "the updated record
// (with its new status_code)" but shows no example. Typed as
// AttendanceRecord on that basis; the registers are refreshed by
// invalidation, not from the response.
export const approveAbsence = ({
  recordId,
  payload,
}: ApproveAbsenceArgs): Promise<AttendanceRecord> => {
  return api.post(`attendance-records/${recordId}/approve`, payload);
};

export const useApproveAbsence = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceRecord, ServerErrorResponse, ApproveAbsenceArgs>({
    mutationFn: approveAbsence,
    // The record's section/term aren't known here, so refresh every
    // loaded register, plus the single-student summaries (which aren't
    // under the register key) since a status change alters the counts.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: attendanceKeys.registers() }),
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.enrolmentSummaries(),
        }),
      ]),
  });
};