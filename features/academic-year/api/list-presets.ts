import { api } from "@/lib/api";
import { EducationPreset } from "../types/api/presets";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { presetKeys } from "./query-keys";

export const listPresets = (): Promise<EducationPreset[]> =>
  api.get("education/presets");

export const useListPresets = (
  options?: Partial<UseQueryOptions<EducationPreset[], ServerErrorResponse>>
) => {
  return useQuery<EducationPreset[], ServerErrorResponse>({
    queryFn: listPresets,
    queryKey: presetKeys.all,
    ...options,
  });
};
