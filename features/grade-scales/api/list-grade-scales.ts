import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { gradeScaleKeys } from "./query-keys";
import { GradeScale } from "../types/api/grade-scale";

export const listGradeScales = (): Promise<GradeScale[]> =>
  api.get("grade-scales");

export const useListGradeScales = (
  options?: Partial<UseQueryOptions<GradeScale[], ServerErrorResponse>>
) => {
  return useQuery<GradeScale[], ServerErrorResponse>({
    queryFn: listGradeScales,
    queryKey: gradeScaleKeys.all,
    ...options,
  });
};
