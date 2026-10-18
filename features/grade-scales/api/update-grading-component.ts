import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { gradingSchemeKeys } from "./query-keys";
import type { CreateGradingComponentFormData } from "../schemas/create-grading-component-schema";
import { ServerErrorResponse } from "@/types/api";

type UpdateGradingComponentVariables = {
  componentId: string;
  data: CreateGradingComponentFormData;
};

export const updateGradingComponent = ({
  componentId,
  data,
}: UpdateGradingComponentVariables): Promise<null> => {
  return api.put(`assessment-components/${componentId}`, data);
};

export const useUpdateGradingComponent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    null,
    ServerErrorResponse,
    UpdateGradingComponentVariables
  >({
    mutationFn: (variables) => {
      return updateGradingComponent(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradingSchemeKeys.all });
    },
  });
};
