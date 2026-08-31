import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { assignedSubjectKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { AssignSubjectFormData } from "../schemas/assign-subject-schema";
import { SubjectAssignmentResponse } from "../types/api/subject-assignments";

export const assignSubjectToLevel = (
  subjectId: string,
  data: AssignSubjectFormData
): Promise<SubjectAssignmentResponse> =>
  api.post(`subjects/${subjectId}/assignments`, data);

export const useAssignSubjectToLevel = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SubjectAssignmentResponse,
    ServerErrorResponse,
    { subjectId: string; data: AssignSubjectFormData }
  >({
    mutationFn: ({ subjectId, data }) => assignSubjectToLevel(subjectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignedSubjectKeys.all });
    },
  });
};
