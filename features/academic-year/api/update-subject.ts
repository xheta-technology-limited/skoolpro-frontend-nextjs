import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { schoolSubjectKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import type { CreateSubjectRequest } from "../schemas/create-subject-schema";

type UpdateSubjectVariables = {
  subjectId: string;
  data: CreateSubjectRequest;
};

export const updateSubject = ({
  subjectId,
  data,
}: UpdateSubjectVariables): Promise<null> => {
  return api.put(`subjects/${subjectId}`, data);
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, UpdateSubjectVariables>({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolSubjectKeys.all });
    },
  });
};
