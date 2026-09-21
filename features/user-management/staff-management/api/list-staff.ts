import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginationMeta, ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { Staff } from "../types/api/staff";

interface StaffResponse {
  data: Staff[];
  meta: PaginationMeta;
}

export type ListStaffParams = {
  search?: string;
  page?: number;
  [key: string]: string | number | undefined;
};

export const listStaff = (params?: ListStaffParams): Promise<StaffResponse> => {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }
  const query = searchParams.toString();
  return api.get(`staff${query ? `?${query}` : ""}`, { raw: true });
};

export const useListStaff = (
  params?: ListStaffParams,
  options?: Partial<UseQueryOptions<StaffResponse, ServerErrorResponse>>
) => {
  return useQuery<StaffResponse, ServerErrorResponse>({
    queryFn: () => listStaff(params),
    queryKey: params?.search
      ? staffKeys.filtered(params.search, params.page)
      : params?.page !== undefined
      ? staffKeys.byPage(params.page)
      : staffKeys.all,
    ...options,
  });
};
