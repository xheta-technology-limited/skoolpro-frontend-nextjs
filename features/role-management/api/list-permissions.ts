import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { PermissionsResponse } from "../types/list-permissions-type";
import { permissionKeys } from "./query-keys";

export const listPermissions = (): Promise<PermissionsResponse> =>
  api.get("permissions");

export const useListPermissions = (
  options?: Partial<UseQueryOptions<PermissionsResponse, ServerErrorResponse>>
) => {
  return useQuery<PermissionsResponse, ServerErrorResponse>({
    queryFn: listPermissions,
    queryKey: permissionKeys.all,
    ...options,
  });
};
