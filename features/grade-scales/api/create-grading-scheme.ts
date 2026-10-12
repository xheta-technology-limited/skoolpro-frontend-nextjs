import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { gradingSchemeKeys } from "./query-keys";
import type { CreateGradingSchemeFormData } from "../schemas/create-grading-scheme-schema";
import { ServerErrorResponse } from "@/types/api";

export const createGradingScheme = (
  data: CreateGradingSchemeFormData
): Promise<null> => {
  return api.post("grading-schemes", data);
};

export const useCreateGradingScheme = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateGradingSchemeFormData>({
    mutationFn: (data) => {
      return createGradingScheme(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradingSchemeKeys.all });
    },
  });
};
