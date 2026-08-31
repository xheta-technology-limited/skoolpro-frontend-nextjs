import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys, armKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { CreateArmFormData } from "../schemas/create-arm";

export const setCurrentTerm = (termID: string): Promise<null> => {
  return api.post(`academic-terms/${termID}/set-current`, {});
};

export const useSetCurrentTerm = (termID: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, {}>({
    mutationFn: () => setCurrentTerm(termID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
