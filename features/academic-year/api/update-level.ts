import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { educationStageKeys, levelKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import type { CreateLevelFormData } from "../schemas/create-level-schema";
import { toCreateLevelPayload } from "./create-level";

type UpdateLevelVariables = {
  levelId: string;
  data: CreateLevelFormData;
};

export const updateLevel = ({
  levelId,
  data,
}: UpdateLevelVariables): Promise<null> => {
  return api.put(`education/levels/${levelId}`, toCreateLevelPayload(data));
};

export const useUpdateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, UpdateLevelVariables>({
    mutationFn: (variables) => {
      return updateLevel(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.all });
      queryClient.invalidateQueries({ queryKey: educationStageKeys.all });
    },
  });
};
