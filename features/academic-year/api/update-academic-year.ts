import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import type { AcademicYearFormData } from "../schemas/create-academic-year-schema";
import { ServerErrorResponse } from "@/types/api";
import { AcademicYear } from "../types/api/academic-year";

type UpdateAcademicYearVariables = {
  yearId: string;
  data: AcademicYearFormData;
};

export const updateAcademicYear = ({
  yearId,
  data,
}: UpdateAcademicYearVariables): Promise<AcademicYear> => {
  return api.put(`academic-years/${yearId}`, data);
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AcademicYear,
    ServerErrorResponse,
    UpdateAcademicYearVariables
  >({
    mutationFn: (variables) => {
      return updateAcademicYear(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
