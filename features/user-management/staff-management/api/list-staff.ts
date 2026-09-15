import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { Staff } from "../types/api/staff";

export const listStaff = (name?: string): Promise<Staff[]> => {
  const queryKey = name ? `?name=${name}` : "";
  return api.get(`staff${queryKey}`);
};

export const useListStaff = (
  name?: string,
  options?: Partial<UseQueryOptions<Staff[], ServerErrorResponse>>
) => {
  return useQuery<Staff[], ServerErrorResponse>({
    queryFn: () => listStaff(name),
    queryKey: name ? staffKeys.filteredByName(name) : staffKeys.all,
    ...options,
  });
};
