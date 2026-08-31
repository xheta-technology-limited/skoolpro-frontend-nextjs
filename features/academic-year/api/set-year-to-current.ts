import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

export const setCurrentYear = (yearID: string): Promise<null> => {
  return api.post(`academic-years/${yearID}/set-current`, {});
};

export const useSetCurrentYear = (yearID: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, {}>({
    mutationFn: () => setCurrentYear(yearID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
