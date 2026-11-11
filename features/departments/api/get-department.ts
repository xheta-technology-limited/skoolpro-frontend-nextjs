import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { Department } from "@/types";
import { departmentKeys } from "./query-keys";

export type DepartmentHead = {
  id: string;
  name?: string | null;
  full_name?: string | null;
  title?: string | null;
};

export type DepartmentDetail = Department & {
  head: DepartmentHead | null;
};

export const getDepartment = (id: string): Promise<DepartmentDetail> => {
  return api.get(`departments/${id}`);
};

export const useGetDepartment = (
  id: string,
  options?: Partial<UseQueryOptions<DepartmentDetail, ServerErrorResponse>>
) => {
  return useQuery<DepartmentDetail, ServerErrorResponse>({
    queryFn: () => getDepartment(id),
    queryKey: departmentKeys.detail(id),
    ...options,
  });
};
