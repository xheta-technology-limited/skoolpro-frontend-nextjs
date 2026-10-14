import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { guardianKeys } from "./query-keys";

export type CreateGuardianLoginData = {
  email: string | undefined;
  roles: string[];
};

export type GuardianLoginResponse = {
  user_id: string;
  email: string;
  temporary_password: string;
  must_change_password: boolean;
};

export const createGuardianLogin = (
  guardianId: string,
  data: CreateGuardianLoginData
): Promise<GuardianLoginResponse> => {
  return api.post(`guardians/${guardianId}/login`, data);
};

export const useCreateGuardianLogin = (guardianId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    GuardianLoginResponse,
    ServerErrorResponse,
    CreateGuardianLoginData
  >({
    mutationFn: (data) => {
      return createGuardianLogin(guardianId, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: guardianKeys.linkedUser(guardianId),
      }),
  });
};