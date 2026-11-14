import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { roleKeys } from "./query-keys";
import { RoleStats } from "../types/get-stats-type";

export const getRoleStats = (): Promise<RoleStats> => {
  return api.get("roles/stats");
};

export const useGetRoleStats = (
  options?: Partial<UseQueryOptions<RoleStats, ServerErrorResponse>>
) => {
  return useQuery<RoleStats, ServerErrorResponse>({
    queryFn: getRoleStats,
    queryKey: roleKeys.stats,
    ...options,
  });
};
