import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type ApproveAcademicYearDraftVariables = {
  academicYearID: string;
};

export const approveAcademicYearDraft = ({
  academicYearID,
}: ApproveAcademicYearDraftVariables): Promise<null> => {
  return api.post(`academic-years/${academicYearID}/approve`);
};

export const useApproveAcademicYearDraft = () => {
  const queryClient = useQueryClient();

  return useMutation<
    null,
    ServerErrorResponse,
    ApproveAcademicYearDraftVariables
  >({
    mutationFn: approveAcademicYearDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
