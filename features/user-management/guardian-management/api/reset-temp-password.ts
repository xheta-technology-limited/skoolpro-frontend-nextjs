import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";

export type ResetTempPasswordData = {
  roles: string[];
};

export type ResetTempPasswordResponse = {
  user_id: string;
  email: string;
  temporary_password: string;
  must_change_password: boolean;
};

export const resetTempPassword = (
  guardianId: string,
  data: ResetTempPasswordData
): Promise<ResetTempPasswordResponse> => {
  return api.post(`guardians/${guardianId}/login/reset-password`, data);
};

export const useResetTempPassword = (guardianId: string) => {
  return useMutation<
    ResetTempPasswordResponse,
    ServerErrorResponse,
    ResetTempPasswordData
  >({
    mutationFn: (data) => resetTempPassword(guardianId, data),
  });
};