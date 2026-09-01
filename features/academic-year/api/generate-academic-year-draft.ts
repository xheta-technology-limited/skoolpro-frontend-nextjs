import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { AcademicYear } from "../types/api/academic-year";

type GenerateAcademicYearDraftVariables = {
  academicYearID: string;
};

export const generateAcademicYearDraft = ({
  academicYearID,
}: GenerateAcademicYearDraftVariables): Promise<AcademicYear> => {
  return api.post(`academic-years/${academicYearID}/generate-next`, {});
};

export const useGenerateAcademicYearDraft = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AcademicYear,
    ServerErrorResponse,
    GenerateAcademicYearDraftVariables
  >({
    mutationFn: generateAcademicYearDraft,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    // },
  });
};
