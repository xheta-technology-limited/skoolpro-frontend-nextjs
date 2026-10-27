import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { educationSummaryKeys } from "./query-keys";

export type EducationSummary = {
  stage_count: number;
  level_count: number;
  active_level_count: number;
  class_section_count: number;
};

export const getEducationSummary = (): Promise<EducationSummary> => {
  return api.get("education/summary", { raw: true });
};

export const useGetEducationSummary = (
  options?: Partial<UseQueryOptions<EducationSummary, ServerErrorResponse>>
) => {
  return useQuery<EducationSummary, ServerErrorResponse>({
    queryFn: getEducationSummary,
    queryKey: educationSummaryKeys.all,
    ...options,
  });
};
