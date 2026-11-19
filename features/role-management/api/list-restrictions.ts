import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { restrictionKeys } from "./query-keys";
import { Restriction } from "../types/api/restriction";

export const listRestrictions = (
  denyableType: string,
  denyableId: string
): Promise<Restriction[]> => {
  return api.get("permission-denials", {
    params: { denyable_type: denyableType, denyable_id: denyableId },
  });
};

export const useListRestrictions = (
  denyableType: string,
  denyableId: string,
  options?: Partial<UseQueryOptions<Restriction[], ServerErrorResponse>>
) => {
  return useQuery<Restriction[], ServerErrorResponse>({
    queryFn: () => listRestrictions(denyableType, denyableId),
    queryKey: restrictionKeys.filtered(denyableType, denyableId),
    ...options,
  });
};
