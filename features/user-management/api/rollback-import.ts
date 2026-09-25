import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";

export const rollbackImport = (jobID: string): Promise<null> => {
  return api.post(`imports/${jobID}/rollback`);
};

export const useRollbackImport = (jobID: string) => {
  return useMutation<null, ServerErrorResponse, void>({
    mutationFn: () => rollbackImport(jobID),
  });
};
