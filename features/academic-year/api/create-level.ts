import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { educationStageKeys, levelKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import type { CreateLevelFormData } from "../schemas/create-level-schema";

export type CreateLevelPayload = Omit<CreateLevelFormData, "position">;

export const toCreateLevelPayload = (
  data: CreateLevelFormData
): CreateLevelPayload => {
  const { position, ...rest } = data;
  return {
    ...rest,
    insert_after_level_id:
      position === "end_of_stage" ? undefined : rest.insert_after_level_id,
  };
};

export const createLevel = (data: CreateLevelFormData): Promise<null> => {
  return api.post("education/levels", toCreateLevelPayload(data));
};

export const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateLevelFormData>({
    mutationFn: (data) => {
      return createLevel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.all });
      queryClient.invalidateQueries({ queryKey: educationStageKeys.all });
    },
  });
};
