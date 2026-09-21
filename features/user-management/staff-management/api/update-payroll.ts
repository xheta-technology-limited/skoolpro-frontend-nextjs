import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { Payroll } from "../types/api/payroll";

type UpdatePayrollVariables = {
  staffId: string;
  data: Payroll;
};

export const updatePayroll = ({
  staffId,
  data,
}: UpdatePayrollVariables): Promise<Payroll> => {
  return api.put(`staff/${staffId}/payroll`, data);
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation<Payroll, ServerErrorResponse, UpdatePayrollVariables>({
    mutationFn: (variables) => {
      return updatePayroll(variables);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.payroll(variables.staffId),
      });
    },
  });
};
