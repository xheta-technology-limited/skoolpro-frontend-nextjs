import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { educationStageKeys } from "./query-keys";
import { EducationStage } from "../types/api/stages";

export const listStages = (): Promise<EducationStage[]> =>
  api.get("education/stages");

export const useListStages = (
  options?: Partial<UseQueryOptions<EducationStage[], ServerErrorResponse>>
) => {
  return useQuery<EducationStage[], ServerErrorResponse>({
    queryFn: listStages,
    queryKey: educationStageKeys.all,
    ...options,
  });
};
