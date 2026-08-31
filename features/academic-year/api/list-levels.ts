import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { levelKeys } from "./query-keys";
import { EducationLevel } from "../types/api/levels";

export const listLevels = (): Promise<EducationLevel[]> =>
  api.get("education/levels");

export const useListLevels = (
  options?: Partial<UseQueryOptions<EducationLevel[], ServerErrorResponse>>
) => {
  return useQuery<EducationLevel[], ServerErrorResponse>({
    queryFn: listLevels,
    queryKey: levelKeys.all,
    ...options,
  });
};
