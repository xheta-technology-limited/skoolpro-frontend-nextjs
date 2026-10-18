import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";

interface DeleteAttendanceRuleArgs {
  ruleId: string;
}

// Confirmed: DELETE /attendance-rules/{rule} — 204, no body. The spec
// documents no delete guard or 422 cases (unlike statuses), but any
// error message the server sends still arrives as the error's
// `message`.
export const deleteAttendanceRule = ({
  ruleId,
}: DeleteAttendanceRuleArgs): Promise<void> => {
  return api.delete(`attendance-rules/${ruleId}`);
};

export const useDeleteAttendanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ServerErrorResponse, DeleteAttendanceRuleArgs>({
    mutationFn: deleteAttendanceRule,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: attendanceKeys.rules() }),
  });
};