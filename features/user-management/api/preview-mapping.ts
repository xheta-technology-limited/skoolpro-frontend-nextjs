import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { importKeys } from "./query-keys";
import { PreviewMappingResponse } from "../types/api/preview-mapping";

export const previewMapping = (
  jobID: string
): Promise<PreviewMappingResponse> => {
  return api.get(`imports/${jobID}/preview-mapping`);
};

export const usePreviewMapping = (
  jobID: string,
  options?: Partial<
    UseQueryOptions<PreviewMappingResponse, ServerErrorResponse>
  >
) => {
  return useQuery<PreviewMappingResponse, ServerErrorResponse>({
    queryFn: () => previewMapping(jobID),
    queryKey: importKeys.preview(jobID),
    ...options,
  });
};
