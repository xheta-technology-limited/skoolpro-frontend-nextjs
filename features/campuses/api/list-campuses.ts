import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { campusKeys } from "./query-keys";
import { Campus } from "../types/api/campus";

export const listCampuses = (): Promise<Campus[]> => api.get("campuses");

export const useListCampuses = (
  options?: Partial<UseQueryOptions<Campus[], ServerErrorResponse>>
) => {
  return useQuery<Campus[], ServerErrorResponse>({
    queryFn: listCampuses,
    queryKey: campusKeys.all,
    ...options,
  });
};