import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type EnableRoleVariables = {
  id: number;
};

export const enableRole = ({ id }: EnableRoleVariables): Promise<null> => {
  return api.post(`roles/${id}/enable`, {});
};

export const useEnableRole = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, EnableRoleVariables>({
    mutationFn: enableRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};
