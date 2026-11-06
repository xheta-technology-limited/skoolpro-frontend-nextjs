import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleKeys } from "./query-keys";
import type { CreateRoleFormData } from "../schemas/create-role-schema";
import { ServerErrorResponse } from "@/types/api";

type UpdateRoleVariables = {
  id: string;
  data: CreateRoleFormData;
};

export const updateRole = ({
  id,
  data,
}: UpdateRoleVariables): Promise<null> => {
  return api.patch(`roles/${id}`, data);
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, UpdateRoleVariables>({
    mutationFn: (variables) => {
      return updateRole(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};
