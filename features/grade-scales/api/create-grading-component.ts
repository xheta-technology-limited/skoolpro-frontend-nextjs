import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { gradingSchemeKeys } from "./query-keys";
import type { CreateGradingComponentFormData } from "../schemas/create-grading-component-schema";
import { ServerErrorResponse } from "@/types/api";

export const createGradingComponent = (
  data: CreateGradingComponentFormData,
  gradingSchemeId: string
): Promise<null> => {
  return api.post(`grading-schemes/${gradingSchemeId}/components`, data);
};

export const useCreateGradingComponent = (gradingSchemeId: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateGradingComponentFormData>(
    {
      mutationFn: (data) => {
        return createGradingComponent(data, gradingSchemeId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: gradingSchemeKeys.detail(gradingSchemeId),
        });
      },
    }
  );
};
