import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type {
  ProvisionGuardianLoginPayload,
  ProvisionGuardianLoginResponse,
} from "../types/provision-guardian-login-types";

interface ProvisionGuardianLoginArgs {
  guardianId: string;
  payload: ProvisionGuardianLoginPayload;
}


export const provisionGuardianLogin = ({
  guardianId,
  payload,
}: ProvisionGuardianLoginArgs): Promise<ProvisionGuardianLoginResponse> => {
  return api.post<ProvisionGuardianLoginResponse>(
    `guardians/${guardianId}/login`,
    payload,
    { raw: true }
  );
};

export const useProvisionGuardianLogin = () => {
  return useMutation<
    ProvisionGuardianLoginResponse,
    ServerErrorResponse,
    ProvisionGuardianLoginArgs
  >({
    mutationFn: provisionGuardianLogin,
  });
};