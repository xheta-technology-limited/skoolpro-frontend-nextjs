import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { importKeys } from "./query-keys";
import { ImportRecord } from "../types/api/template";

export const getSingleImport = (jobID: string): Promise<ImportRecord> => {
  return api.get(`imports/${jobID}`);
};

export const useGetSingleImport = (
  jobID: string,
  options?: Partial<UseQueryOptions<ImportRecord, ServerErrorResponse>>
) => {
  return useQuery<ImportRecord, ServerErrorResponse>({
    queryFn: () => getSingleImport(jobID),
    queryKey: importKeys.detail(jobID),
    ...options,
  });
};
