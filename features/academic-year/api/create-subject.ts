import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { schoolSubjectKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { Subject } from "../types/api/subjects";
import { CreateSubjectRequest } from "../schemas/create-subject-schema";

export const createSubject = (data: CreateSubjectRequest): Promise<Subject> => {
  return api.post("subjects", data);
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<Subject, ServerErrorResponse, CreateSubjectRequest>({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolSubjectKeys.all });
    },
  });
};
