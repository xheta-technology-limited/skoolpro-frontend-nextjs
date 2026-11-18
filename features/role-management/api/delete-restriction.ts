import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { restrictionKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DeleteRestrictionVariables = {
  id: string;
};

export const deleteRestriction = ({
  id,
}: DeleteRestrictionVariables): Promise<null> => {
  return api.delete(`permission-denials/${id}`);
};

export const useDeleteRestriction = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteRestrictionVariables>({
    mutationFn: deleteRestriction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restrictionKeys.all });
    },
  });
};
