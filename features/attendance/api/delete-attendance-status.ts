import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";

interface DeleteAttendanceStatusArgs {
  statusId: string;
}

// Confirmed: DELETE /attendance-statuses/{status} — 204, no body.
// 422 delete guard: the last present-counting status and the last
// absent status can't be removed (a register needs at least one of
// each). The server's message arrives as the error's `message`.
export const deleteAttendanceStatus = ({
  statusId,
}: DeleteAttendanceStatusArgs): Promise<void> => {
  return api.delete(`attendance-statuses/${statusId}`);
};

export const useDeleteAttendanceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ServerErrorResponse, DeleteAttendanceStatusArgs>({
    mutationFn: deleteAttendanceStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: attendanceKeys.statuses() }),
  });
};