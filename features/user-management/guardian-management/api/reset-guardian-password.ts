import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type { ResetGuardianPasswordResponse } from "../types/reset-guardian-password-types";

interface ResetGuardianPasswordArgs {
  guardianId: string;
}

export const resetGuardianPassword = ({
  guardianId,
}: ResetGuardianPasswordArgs): Promise<ResetGuardianPasswordResponse> => {
  return api.post<ResetGuardianPasswordResponse>(
    `guardians/${guardianId}/login/reset-password`,
    undefined,
    { raw: true }
  );
};

export const useResetGuardianPassword = () => {
  return useMutation<
    ResetGuardianPasswordResponse,
    ServerErrorResponse,
    ResetGuardianPasswordArgs
  >({
    mutationFn: resetGuardianPassword,
  });
};