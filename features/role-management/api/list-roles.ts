import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { roleKeys } from "./query-keys";
import { Role } from "../types/api/role";

export const listRoles = (): Promise<Role[]> => api.get("roles");

export const useListRoles = (
  options?: Partial<UseQueryOptions<Role[], ServerErrorResponse>>
) => {
  return useQuery<Role[], ServerErrorResponse>({
    queryFn: listRoles,
    queryKey: roleKeys.all,
    ...options,
  });
};
