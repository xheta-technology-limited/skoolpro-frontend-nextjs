import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginationMeta, ServerErrorResponse } from "@/types/api";
import { roleKeys } from "./query-keys";
import { Role } from "../types/api/role";

type Response = {
  meta: PaginationMeta;
  data: Role[];
};
export type ListRolesParams = {
  disabled?: boolean;
  role_type?: "custom" | "system";
  page?: number;
};
export const listRoles = (params?: ListRolesParams): Promise<Response> => {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }
  const query = searchParams.toString();
  return api.get(`roles${query ? `?${query}` : ""}`, { raw: true });
};

export const useListRoles = (
  params?: ListRolesParams,
  options?: Partial<UseQueryOptions<Response, ServerErrorResponse>>
) => {
  return useQuery<Response, ServerErrorResponse>({
    queryFn: () => listRoles(params),
    queryKey: roleKeys.filtered(
      params?.role_type,
      params?.disabled,
      params?.page
    ),
    ...options,
  });
};
