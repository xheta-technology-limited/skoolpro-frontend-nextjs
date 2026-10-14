import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { gradeScaleKeys } from "./query-keys";
import { GradeScale } from "../types/api/grade-scale";

export const getGradeScale = (scaleId: string): Promise<GradeScale> => {
  return api.get(`grade-scales/${scaleId}`);
};

export const useGetGradeScale = (
  scaleId: string,
  options?: Partial<UseQueryOptions<GradeScale, ServerErrorResponse>>
) => {
  return useQuery<GradeScale, ServerErrorResponse>({
    queryFn: () => getGradeScale(scaleId),
    queryKey: gradeScaleKeys.detail(scaleId),
    ...options,
  });
};
