import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  AttendanceRule,
  SetAttendanceRulePayload,
} from "../types/attendance-rule-types";

// Confirmed: POST /attendance-rules (201 — the rule). Requires
// `attendance.rules.create`. It upserts per scope, so one call both
// creates a rule and updates the existing one for that scope.
// 422 messages: a percentage outside 0–100, or the critical percentage
// above the warning one. The server's message arrives as the error's
// `message`.
export const setAttendanceRule = (
  payload: SetAttendanceRulePayload
): Promise<AttendanceRule> => {
  return api.post("attendance-rules", payload);
};

export const useSetAttendanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AttendanceRule,
    ServerErrorResponse,
    SetAttendanceRulePayload
  >({
    mutationFn: setAttendanceRule,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: attendanceKeys.rules() }),
  });
};