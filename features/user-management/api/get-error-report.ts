import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { importKeys } from "./query-keys";

export const getErrorReport = (jobID: string): Promise<Blob> => {
  return api.get(`imports/${jobID}/error-report`, {
    raw: true,
    responseType: "blob",
  });
};
export const useGetErrorReport = (
  jobID: string,
  options?: Partial<UseQueryOptions<Blob, ServerErrorResponse>>
) => {
  return useQuery<Blob, ServerErrorResponse>({
    queryFn: () => getErrorReport(jobID),
    queryKey: importKeys.errors(jobID),
    ...options,
  });
};
