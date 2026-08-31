import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { armKeys } from "./query-keys";
import { EducationArm } from "../types/api/arms";

export const listArms = (level: string): Promise<EducationArm[]> =>
  api.get(`education/levels/${level}/sections`);

export const useListArms = (
  level: string,
  options?: Partial<UseQueryOptions<EducationArm[], ServerErrorResponse>>
) => {
  return useQuery<EducationArm[], ServerErrorResponse>({
    queryFn: () => listArms(level),
    queryKey: armKeys.detail(level),
    ...options,
  });
};
