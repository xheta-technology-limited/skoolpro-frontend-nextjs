import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleKeys } from "./query-keys";
import type { CreateRoleFormData } from "../schemas/create-role-schema";
import { ServerErrorResponse } from "@/types/api";

export const createRole = (data: CreateRoleFormData): Promise<null> => {
  return api.post("roles", data);
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateRoleFormData>({
    mutationFn: (data) => {
      return createRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};
