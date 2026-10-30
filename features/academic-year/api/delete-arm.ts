import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { armKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DeleteArmVariables = {
  armId: string;
};

export const deleteArm = ({ armId }: DeleteArmVariables): Promise<null> => {
  return api.delete(`class-sections/${armId}`);
};

export const useDeleteArm = (level: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteArmVariables>({
    mutationFn: deleteArm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: armKeys.detail(level) });
    },
  });
};
