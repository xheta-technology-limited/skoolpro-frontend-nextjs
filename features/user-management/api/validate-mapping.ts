import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord } from "../types/api/template";
import { importKeys } from "./query-keys";

export const validateMapping = (jobID: string): Promise<ImportRecord> => {
  return api.post(`imports/${jobID}/validate`);
};

export const useValidateMapping = (jobID: string) => {
  const queryClient = useQueryClient();
  return useMutation<ImportRecord, ServerErrorResponse>({
    mutationFn: () => validateMapping(jobID),
    onSuccess: () =>
      queryClient.invalidateQueries({
        //TODO: I think I fixed this on dev branch, but idk. Check.
        queryKey: [...importKeys.detail(jobID), ...importKeys.preview(jobID)],
      }),
  });
};
