import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { guardianKeys } from "./query-keys";
import { LinkedGuardian } from "../types/api/linked-guardian";

export const getLinkedGuardian = (
  guardianId: string
): Promise<LinkedGuardian> => {
  return api.get(`guardians/${guardianId}/linked-user`);
};

export const useGetLinkedGuardian = (
  guardianId: string,
  options?: Partial<UseQueryOptions<LinkedGuardian, ServerErrorResponse>>
) => {
  return useQuery<LinkedGuardian, ServerErrorResponse>({
    queryFn: () => getLinkedGuardian(guardianId),
    queryKey: guardianKeys.linkedUser(guardianId),

    ...options,
  });
};