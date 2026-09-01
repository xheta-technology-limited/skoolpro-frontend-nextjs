import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DiscardDraftVariables = {
  academicYearID: string;
};

export const discardDraft = ({
  academicYearID,
}: DiscardDraftVariables): Promise<null> => {
  return api.delete(`academic-years/${academicYearID}`);
};

export const useDiscardDraft = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DiscardDraftVariables>({
    mutationFn: discardDraft,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    // },
  });
};
