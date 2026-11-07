import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DisableRoleVariables = {
  id: string;
};

export const disableRole = ({ id }: DisableRoleVariables): Promise<null> => {
  return api.delete(`roles/${id}`);
};

export const useDisableRole = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DisableRoleVariables>({
    mutationFn: disableRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};
