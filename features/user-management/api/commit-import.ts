import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord } from "../types/api/template";

export const commitImport = <ColumnMapping extends Record<string, string>>(
  jobID: string
): Promise<ImportRecord<ColumnMapping>> => {
  return api.post(`imports/${jobID}/commit`);
};

export const useCommitImport = <ColumnMapping extends Record<string, string>>(
  jobID: string
) => {
  return useMutation<ImportRecord<ColumnMapping>, ServerErrorResponse, void>({
    mutationFn: () => commitImport(jobID),
  });
};
