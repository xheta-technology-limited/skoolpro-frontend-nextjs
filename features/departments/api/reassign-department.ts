import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { departmentKeys } from "./query-keys";

export type ReassignDepartmentPayload = {
  to_department_id: string;
};

export type ReassignDepartmentResult = {
  reassigned: {
    subjects: number;
    staff: number;
  };
};

type ReassignDepartmentVariables = {
  id: string;
  data: ReassignDepartmentPayload;
};

/** Move a department's live subjects and staff to another department. */
export const reassignDepartment = ({
  id,
  data,
}: ReassignDepartmentVariables): Promise<ReassignDepartmentResult> => {
  return api.post(`departments/${id}/reassign`, data);
};

/** Mutation hook that reassigns department members and refreshes the list. */
export const useReassignDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ReassignDepartmentResult,
    ServerErrorResponse,
    ReassignDepartmentVariables
  >({
    mutationFn: (variables) => {
      return reassignDepartment(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
