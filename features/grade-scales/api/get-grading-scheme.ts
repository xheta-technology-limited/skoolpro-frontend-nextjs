import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { gradingSchemeKeys } from "./query-keys";
import { GradingScheme } from "../types/api/grading-scheme";

export const getGradingScheme = (schemeId: string): Promise<GradingScheme> => {
  return api.get(`grading-schemes/${schemeId}`);
};

export const useGetGradingScheme = (
  schemeId: string,
  options?: Partial<UseQueryOptions<GradingScheme, ServerErrorResponse>>
) => {
  return useQuery<GradingScheme, ServerErrorResponse>({
    queryFn: () => getGradingScheme(schemeId),
    queryKey: gradingSchemeKeys.detail(schemeId),
    ...options,
  });
};
