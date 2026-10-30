import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { assignedSubjectKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DeleteSubjectAssignmentVariables = {
  assignmentId: string;
};

export const deleteSubjectAssignment = ({
  assignmentId,
}: DeleteSubjectAssignmentVariables): Promise<null> => {
  return api.delete(`subject-assignments/${assignmentId}`);
};

export const useDeleteSubjectAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    null,
    ServerErrorResponse,
    DeleteSubjectAssignmentVariables
  >({
    mutationFn: deleteSubjectAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignedSubjectKeys.all });
    },
  });
};
