import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord } from "../types/api/template";
import { importKeys } from "./query-keys";

export const validateMapping = <ColumnMapping extends Record<string, string>>(
  jobID: string
): Promise<ImportRecord<ColumnMapping>> => {
  return api.post(`imports/${jobID}/validate`);
};

export const useValidateMapping = <
  ColumnMapping extends Record<string, string>
>(
  jobID: string
) => {
  const queryClient = useQueryClient();
  return useMutation<ImportRecord<ColumnMapping>, ServerErrorResponse>({
    mutationFn: () => validateMapping(jobID),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: importKeys.detail(jobID) }),
        queryClient.invalidateQueries({ queryKey: importKeys.preview(jobID) }),
      ]),
  });
};
