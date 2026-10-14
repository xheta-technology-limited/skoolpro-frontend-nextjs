import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { gradeScaleKeys } from "./query-keys";
import type { CreateBandFormData } from "../schemas/create-band-schema";
import { ServerErrorResponse } from "@/types/api";
import { GradeScaleBand } from "../types/api/grade-scale";

type UpdateBandVariables = {
  bandId: string;
  data: CreateBandFormData;
};

export const updateBand = ({
  bandId,
  data,
}: UpdateBandVariables): Promise<GradeScaleBand> => {
  return api.put(`grade-bands/${bandId}`, data);
};

export const useUpdateBand = () => {
  const queryClient = useQueryClient();

  return useMutation<GradeScaleBand, ServerErrorResponse, UpdateBandVariables>({
    mutationFn: (variables) => {
      return updateBand(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeScaleKeys.all });
    },
  });
};
