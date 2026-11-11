import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { departmentKeys } from "./query-keys";
import type { DepartmentActivation } from "./deactivate-department";

/** Activate a department by id. */
export const activateDepartment = (
  id: string
): Promise<DepartmentActivation> => {
  return api.post(`departments/${id}/activate`, {});
};

/** Mutation hook that activates a department and refreshes department queries. */
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
