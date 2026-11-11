import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { Department } from "@/types";
import { departmentKeys } from "./query-keys";

export type CreateDepartmentPayload = {
  name: string;
  code?: string | null;
  description?: string | null;
  head_staff_id?: string | null;
  is_active?: boolean;
};

export const createDepartment = (
  data: CreateDepartmentPayload
): Promise<Department> => {
  return api.post("departments", data);
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, ServerErrorResponse, CreateDepartmentPayload>({
    mutationFn: (data) => {
      return createDepartment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
