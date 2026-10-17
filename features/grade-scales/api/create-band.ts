import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { gradeScaleKeys } from "./query-keys";
import type { CreateBandFormData } from "../schemas/create-band-schema";
import { ServerErrorResponse } from "@/types/api";
import { GradeScaleBand } from "../types/api/grade-scale";

export const createBand = (
  data: CreateBandFormData,
  gradeScaleID: string
): Promise<GradeScaleBand> => {
  return api.post(`grade-scales/${gradeScaleID}/bands`, data);
};

export const useCreateBand = (gradeScaleID: string) => {
  const queryClient = useQueryClient();

  return useMutation<GradeScaleBand, ServerErrorResponse, CreateBandFormData>({
    mutationFn: (data) => {
      return createBand(data, gradeScaleID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gradeScaleKeys.detail(gradeScaleID),
      });
      queryClient.invalidateQueries({
        queryKey: gradeScaleKeys.all,
      });
    },
  });
};
