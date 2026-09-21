import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";

export type ResetTempPasswordData = {
  roles: string[];
};

export type ResetTempPasswordResponse = {
  temporary_password: string;
};

export const resetStaffLogin = (
  staffId: string,
  data: ResetTempPasswordData
): Promise<ResetTempPasswordResponse> => {
  return api.post(`staff/${staffId}/login/reset-password`, data);
};

export const useResetTempPassword = (staffId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    ResetTempPasswordResponse,
    ServerErrorResponse,
    ResetTempPasswordData
  >({
    mutationFn: (data) => {
      return resetStaffLogin(staffId, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: staffKeys.linkedUser(staffId),
      }),
  });
};
