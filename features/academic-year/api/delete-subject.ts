import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { schoolSubjectKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DeleteSubjectVariables = {
  subjectId: string;
};

export const deleteSubject = ({ subjectId }: DeleteSubjectVariables): Promise<null> => {
  return api.delete(`subjects/${subjectId}`);
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteSubjectVariables>({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolSubjectKeys.all });
    },
  });
};
