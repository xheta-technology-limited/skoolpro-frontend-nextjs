import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  AttendanceStatus,
  CreateAttendanceStatusPayload,
} from "../types/attendance-status-types";

// Confirmed: POST /attendance-statuses (201 — the created status).
// 422 messages: duplicate code for the school, or a status requiring a
// document without also requiring a reason.
export const createAttendanceStatus = (
  payload: CreateAttendanceStatusPayload
): Promise<AttendanceStatus> => {
  return api.post("attendance-statuses", payload);
};

export const useCreateAttendanceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AttendanceStatus,
    ServerErrorResponse,
    CreateAttendanceStatusPayload
  >({
    mutationFn: createAttendanceStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: attendanceKeys.statuses() }),
  });
};