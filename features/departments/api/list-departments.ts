import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginationMeta, ServerErrorResponse } from "@/types/api";
import { Department } from "@/types";
import { departmentKeys } from "./query-keys";

interface DepartmentResponse {
  data: Department[];
  meta: PaginationMeta;
}

export type ListDepartmentsParams = {
  active?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
};

export const listDepartments = (
  params?: ListDepartmentsParams
): Promise<DepartmentResponse> => {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }
  const query = searchParams.toString();
  return api.get(`departments${query ? `?${query}` : ""}`, { raw: true });
};

export const useListDepartments = (
  params?: ListDepartmentsParams,
  options?: Partial<UseQueryOptions<DepartmentResponse, ServerErrorResponse>>
) => {
  return useQuery<DepartmentResponse, ServerErrorResponse>({
    queryFn: () => listDepartments(params),
    queryKey: departmentKeys.filtered(
      params?.search,
      params?.active,
      params?.page
    ),
    ...options,
  });
};
