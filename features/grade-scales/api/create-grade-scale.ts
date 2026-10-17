import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { gradeScaleKeys } from "./query-keys";
import type { CreateGradeScaleFormData } from "../schemas/create-grade-scale-schema";
import { ServerErrorResponse } from "@/types/api";
import { GradeScale } from "../types/api/grade-scale";

export const createGradeScale = (
  data: CreateGradeScaleFormData
): Promise<GradeScale> => {
  return api.post("grade-scales", data);
};

export const useCreateGradeScale = () => {
  const queryClient = useQueryClient();

  return useMutation<
    GradeScale,
    ServerErrorResponse,
    CreateGradeScaleFormData
  >({
    mutationFn: (data) => {
      return createGradeScale(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeScaleKeys.all });
    },
  });
};