import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { gradingSchemeKeys } from "./query-keys";
import { GradingScheme } from "../types/api/grading-scheme";

export const listGradingSchemes = (): Promise<GradingScheme[]> =>
  api.get("grading-schemes");

export const useListGradingSchemes = (
  options?: Partial<UseQueryOptions<GradingScheme[], ServerErrorResponse>>
) => {
  return useQuery<GradingScheme[], ServerErrorResponse>({
    queryFn: listGradingSchemes,
    queryKey: gradingSchemeKeys.all,
    ...options,
  });
};
