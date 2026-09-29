import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { importKeys } from "./query-keys";
import { PreviewMappingResponse } from "../types/api/preview-mapping";

export const previewMapping = <
  ExpectedColumns extends Record<string, string>
>(
  jobID: string
): Promise<PreviewMappingResponse<ExpectedColumns>> => {
  return api.get(`imports/${jobID}/preview-mapping`);
};

export const usePreviewMapping = <
  ExpectedColumns extends Record<string, string>
>(
  jobID: string,
  options?: Partial<
    UseQueryOptions<PreviewMappingResponse<ExpectedColumns>, ServerErrorResponse>
  >
) => {
  return useQuery<PreviewMappingResponse<ExpectedColumns>, ServerErrorResponse>({
    queryFn: () => previewMapping<ExpectedColumns>(jobID),
    queryKey: importKeys.preview(jobID),
    ...options,
  });
};
