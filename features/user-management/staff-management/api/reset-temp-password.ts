import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";

export type ResetTempPasswordResponse = {
  temporary_password: string;
};

export const createStaffLogin = (
  staffId: string
): Promise<ResetTempPasswordResponse> => {
  return api.post(`staff/${staffId}/login/reset-password`, {});
};

export const useResetTempPassword = (staffId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ResetTempPasswordResponse, ServerErrorResponse>({
    mutationFn: () => {
      return createStaffLogin(staffId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: staffKeys.linkedUser(staffId),
      }),
  });
};
