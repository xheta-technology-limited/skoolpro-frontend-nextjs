import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { Department } from "@/types";
import { departmentKeys } from "./query-keys";

export type DepartmentActivation = Omit<
  Department,
  "subjects_count" | "staff_count"
>;

export const deactivateDepartment = (
  id: string
): Promise<DepartmentActivation> => {
  return api.post(`departments/${id}/deactivate`, {});
};

export const useDeactivateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<DepartmentActivation, ServerErrorResponse, string>({
    mutationFn: (id) => {
      return deactivateDepartment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
