import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginationMeta, ServerErrorResponse } from "@/types/api";
import { userKeys } from "./query-keys";
import { User } from "../types/api/user";

interface UsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export const listUsers = (): Promise<UsersResponse> => {
  return api.get("users", { raw: true });
};

export const useListUsers = (
  options?: Partial<UseQueryOptions<UsersResponse, ServerErrorResponse>>
) => {
  return useQuery<UsersResponse, ServerErrorResponse>({
    queryFn: listUsers,
    queryKey: userKeys.all,
    ...options,
  });
};
