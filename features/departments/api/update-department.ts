import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { Department } from "@/types";
import { departmentKeys } from "./query-keys";

export type UpdateDepartmentPayload = {
  name?: string;
  code?: string | null;
  description?: string | null;
  head_staff_id?: string | null;
  is_active?: boolean;
};

type UpdateDepartmentVariables = {
  id: string;
  data: UpdateDepartmentPayload;
};

export const updateDepartment = ({
  id,
  data,
}: UpdateDepartmentVariables): Promise<Department> => {
  return api.put(`departments/${id}`, data);
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Department,
    ServerErrorResponse,
    UpdateDepartmentVariables
  >({
    mutationFn: (variables) => {
      return updateDepartment(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
