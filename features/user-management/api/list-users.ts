import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginationMeta, ServerErrorResponse } from "@/types/api";
import { userKeys } from "./query-keys";
import { User } from "../types/api/user";

interface UsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export type ListUsersParams = {
  page?: number;
  [key: string]: string | number | undefined;
};

export const listUsers = (params?: ListUsersParams): Promise<UsersResponse> => {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }
  const query = searchParams.toString();
  return api.get(`users${query ? `?${query}` : ""}`, { raw: true });
};

export const useListUsers = (
  params?: ListUsersParams,
  options?: Partial<UseQueryOptions<UsersResponse, ServerErrorResponse>>
) => {
  return useQuery<UsersResponse, ServerErrorResponse>({
    queryFn: () => listUsers(params),
    queryKey:
      params?.page !== undefined ? userKeys.byPage(params.page) : userKeys.all,
    ...options,
  });
};
