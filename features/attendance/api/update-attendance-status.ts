import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  AttendanceStatus,
  UpdateAttendanceStatusPayload,
} from "../types/attendance-status-types";

interface UpdateAttendanceStatusArgs {
  statusId: string;
  payload: UpdateAttendanceStatusPayload;
}

// Confirmed: PUT /attendance-statuses/{status}, same fields as create.
//
// Response shape is UNCONFIRMED — the spec shows "200" with no example
// body. Typed as the updated AttendanceStatus on the assumption that it
// mirrors create's response. Verify before reading anything off the
// result; the list is refreshed by invalidation, not from the response.
export const updateAttendanceStatus = ({
  statusId,
  payload,
}: UpdateAttendanceStatusArgs): Promise<AttendanceStatus> => {
  return api.put(`attendance-statuses/${statusId}`, payload);
};

export const useUpdateAttendanceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AttendanceStatus,
    ServerErrorResponse,
    UpdateAttendanceStatusArgs
  >({
    mutationFn: updateAttendanceStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: attendanceKeys.statuses() }),
  });
};