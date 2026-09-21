import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { classSectionKeys } from "./query-keys";
import { ClassSection } from "../types/api/class-sections";

export const listClassSections = (): Promise<ClassSection[]> =>
  api.get("class-sections");

export const useListClassSections = (
  options?: Partial<UseQueryOptions<ClassSection[], ServerErrorResponse>>
) => {
  return useQuery<ClassSection[], ServerErrorResponse>({
    queryFn: listClassSections,
    queryKey: classSectionKeys.all,
    ...options,
  });
};