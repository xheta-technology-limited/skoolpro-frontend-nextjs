import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import type { AcademicYearFormData } from "../schemas/create-academic-year-schema";
import { ServerErrorResponse } from "@/types/api";
import { AcademicYear } from "../types/api/academic-year";

export const createAcademicYear = (
  data: AcademicYearFormData
): Promise<AcademicYear> => {
  return api.post("academic-years", data);
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation<AcademicYear, ServerErrorResponse, AcademicYearFormData>({
    mutationFn: (data) => {
      return createAcademicYear(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
