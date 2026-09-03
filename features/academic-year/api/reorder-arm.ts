import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { armKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

interface MutateParams {
  payload: { position: number };
  armID: string;
}
export const reorderArm = (params: MutateParams): Promise<null> => {
  return api.post(`class-sections/${params.armID}/move`, params.payload);
};

export const useReorderArm = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, MutateParams>({
    mutationFn: (params) => {
      return reorderArm(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: armKeys.all });
    },
  });
};
