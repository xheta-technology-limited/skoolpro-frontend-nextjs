import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import {
  ApplyMappingPayload,
  ApplyMappingResponse,
} from "../types/api/template";

export const applyMapping = (
  jobID: string,
  data: ApplyMappingPayload
): Promise<ApplyMappingResponse> => {
  return api.post(`imports/${jobID}/apply-mapping`, data);
};

export const useApplyMapping = (jobID: string) => {
  return useMutation<
    ApplyMappingResponse,
    ServerErrorResponse,
    ApplyMappingPayload
  >({
    mutationFn: (data) => applyMapping(jobID, data),
  });
};
