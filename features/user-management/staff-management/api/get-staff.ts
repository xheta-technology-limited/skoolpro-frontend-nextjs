import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { Staff } from "../types/api/staff";

export const getStaff = (id: string): Promise<Staff> => {
  return api.get(`staff/${id}`);
};

export const useGetStaff = (
  id: string,
  options?: Partial<UseQueryOptions<Staff, ServerErrorResponse>>
) => {
  return useQuery<Staff, ServerErrorResponse>({
    queryFn: () => getStaff(id),
    queryKey: staffKeys.detail(id),
    ...options,
  });
};
