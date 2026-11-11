import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { departmentKeys } from "./query-keys";
import type { DepartmentActivation } from "./deactivate-department";

export const activateDepartment = (
  id: string
): Promise<DepartmentActivation> => {
  return api.post(`departments/${id}/activate`, {});
};

export const useActivateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<DepartmentActivation, ServerErrorResponse, string>({
    mutationFn: (id) => {
      return activateDepartment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
