import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { educationStageKeys } from "./query-keys";
import type { CreateStageFormData } from "../schemas/create-stage-schema";
import { ServerErrorResponse } from "@/types/api";

export const createStage = (data: CreateStageFormData): Promise<null> => {
  return api.post("education/stages", data);
};

export const useCreateStage = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateStageFormData>({
    mutationFn: (data) => {
      return createStage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationStageKeys.all });
    },
  });
};
