import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { roleKeys } from "./query-keys";
import { RoleDetail } from "../types/get-role-type";

export const getRole = (id: string): Promise<RoleDetail> => {
  return api.get(`roles/${id}`);
};

export const useGetRole = (
  id: string,
  options?: Partial<UseQueryOptions<RoleDetail, ServerErrorResponse>>
) => {
  return useQuery<RoleDetail, ServerErrorResponse>({
    queryFn: () => getRole(id),
    queryKey: roleKeys.detail(id),
    ...options,
  });
};
