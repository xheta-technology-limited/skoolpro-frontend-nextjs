import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { importKeys } from "./query-keys";
import { ImportRecord } from "../types/api/template";

export const getSingleImport = <ColumnMapping extends Record<string, string>>(
  jobID: string
): Promise<ImportRecord<ColumnMapping>> => {
  return api.get(`imports/${jobID}`);
};

export const useGetSingleImport = <
  ColumnMapping extends Record<string, string>
>(
  jobID: string,
  options?: Partial<
    UseQueryOptions<ImportRecord<ColumnMapping>, ServerErrorResponse>
  >
) => {
  return useQuery<ImportRecord<ColumnMapping>, ServerErrorResponse>({
    queryFn: () => getSingleImport(jobID),
    queryKey: importKeys.detail(jobID),
    ...options,
  });
};
