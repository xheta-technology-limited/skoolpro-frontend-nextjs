import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord } from "../types/api/template";

export const commitImport = (jobID: string): Promise<ImportRecord> => {
  return api.post(`imports/${jobID}/commit`);
};

export const useCommitImport = (jobID: string) => {
  return useMutation<ImportRecord, ServerErrorResponse, void>({
    mutationFn: () => commitImport(jobID),
  });
};
