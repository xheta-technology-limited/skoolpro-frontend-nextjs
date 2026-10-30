import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { assignedSubjectKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import type { UpdateSubjectAssignmentFormData } from "../schemas/update-subject-assignment-schema";

type UpdateSubjectAssignmentVariables = {
  assignmentId: string;
  data: UpdateSubjectAssignmentFormData;
};

export const updateSubjectAssignment = ({
  assignmentId,
  data,
}: UpdateSubjectAssignmentVariables): Promise<null> => {
  return api.put(`subject-assignments/${assignmentId}`, data);
};

export const useUpdateSubjectAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    null,
    ServerErrorResponse,
    UpdateSubjectAssignmentVariables
  >({
    mutationFn: (variables) => {
      return updateSubjectAssignment(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignedSubjectKeys.all });
    },
  });
};
