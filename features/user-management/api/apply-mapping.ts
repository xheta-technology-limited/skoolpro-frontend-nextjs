import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import {
  ApplyMappingPayload,
  ApplyMappingResponse,
} from "../types/api/template";

export const applyMapping = <ColumnMapping extends Record<string, string>>(
  jobID: string,
  data: ApplyMappingPayload
): Promise<ApplyMappingResponse<ColumnMapping>> => {
  return api.post(`imports/${jobID}/apply-mapping`, data);
};

export const useApplyMapping = <ColumnMapping extends Record<string, string>>(
  jobID: string
) => {
  return useMutation<
    ApplyMappingResponse<ColumnMapping>,
    ServerErrorResponse,
    ApplyMappingPayload
  >({
    mutationFn: (data) => applyMapping(jobID, data),
  });
};
