import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { levelKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DeleteLevelVariables = {
  levelId: string;
};

export const deleteLevel = ({
  levelId,
}: DeleteLevelVariables): Promise<null> => {
  return api.delete(`education/levels/${levelId}`);
};

export const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteLevelVariables>({
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.all });
    },
  });
};
