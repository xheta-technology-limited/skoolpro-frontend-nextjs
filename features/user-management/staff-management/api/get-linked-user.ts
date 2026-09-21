import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { LinkedUser } from "../types/api/linked-user";

export const getLinkedUser = (staffId: string): Promise<LinkedUser> => {
  return api.get(`staff/${staffId}/linked-user`);
};

export const useGetLinkedUser = (
  staffId: string,
  options?: Partial<UseQueryOptions<LinkedUser, ServerErrorResponse>>
) => {
  return useQuery<LinkedUser, ServerErrorResponse>({
    queryFn: () => getLinkedUser(staffId),
    queryKey: staffKeys.linkedUser(staffId),

    ...options,
  });
};
