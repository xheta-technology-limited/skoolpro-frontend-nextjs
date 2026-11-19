import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleKeys } from "./query-keys";
import type { CloneRoleFormData } from "../schemas/clone-role-schema";
import { ServerErrorResponse } from "@/types/api";

type CloneRoleVariables = {
  id: string;
  data: CloneRoleFormData;
};

export const cloneRole = ({ id, data }: CloneRoleVariables): Promise<null> => {
  return api.post(`roles/${id}/clone`, data);
};

export const useCloneRole = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CloneRoleVariables>({
    mutationFn: (variables) => {
      return cloneRole(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};
