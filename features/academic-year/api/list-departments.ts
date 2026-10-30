import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { departmentKeys } from "./query-keys";
import { Department } from "../types/api/list-departments-type";

export const listDepartments = (): Promise<Department[]> =>
  api.get("departments");

export const useListDepartments = (
  options?: Partial<UseQueryOptions<Department[], ServerErrorResponse>>
) => {
  return useQuery<Department[], ServerErrorResponse>({
    queryFn: listDepartments,
    queryKey: departmentKeys.all,
    ...options,
  });
};
