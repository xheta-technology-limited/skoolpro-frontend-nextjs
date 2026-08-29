import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { EducationStructureFormData } from "../schemas/create-education-structure-schema";
import { ApplyEducationPresetResponse } from "../types/api/presets";

export const applyEducationPreset = (
  data: EducationStructureFormData,
  presetKey: string
): Promise<ApplyEducationPresetResponse> => {
  return api.post(`education/presets/${presetKey}/apply`, data);
};

export const useApplyEducationPreset = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApplyEducationPresetResponse,
    ServerErrorResponse,
    EducationStructureFormData
  >({
    mutationFn: (data) => {
      return applyEducationPreset(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
