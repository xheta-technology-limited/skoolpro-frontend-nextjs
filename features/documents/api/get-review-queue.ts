import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  GetDocumentsResponse,
  GetReviewQueueParams,
} from "../types/document-types";

export const getReviewQueue = (
  params: GetReviewQueueParams = {}
): Promise<GetDocumentsResponse> => {
  return api.get("documents/review-queue", { params, raw: true });
};

export const useGetReviewQueue = (
  params: GetReviewQueueParams = {},
  options?: Partial<UseQueryOptions<GetDocumentsResponse, ServerErrorResponse>>
) => {
  return useQuery<GetDocumentsResponse, ServerErrorResponse>({
    queryKey: documentKeys.reviewQueue(params),
    queryFn: () => getReviewQueue(params),
    ...options,
  });
};