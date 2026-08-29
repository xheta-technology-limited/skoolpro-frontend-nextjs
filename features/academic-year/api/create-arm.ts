import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { armKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { CreateArmFormData } from "../schemas/create-arm";

export const createArm = (
  data: CreateArmFormData,
  level: string
): Promise<null> => {
  return api.post(`education/levels/${level}/section`, data);
};

export const useCreateArm = (level: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateArmFormData>({
    mutationFn: (data) => {
      return createArm(data, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: armKeys.detail(level) });
    },
  });
};
