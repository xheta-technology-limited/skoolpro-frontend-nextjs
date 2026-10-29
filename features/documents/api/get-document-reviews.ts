import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type { DocumentReview } from "../types/document-types";

export const getDocumentReviews = (
  documentId: string
): Promise<DocumentReview[]> => {
  return api.get(`documents/${documentId}/reviews`);
};

export const useGetDocumentReviews = (
  documentId: string,
  options?: Partial<UseQueryOptions<DocumentReview[], ServerErrorResponse>>
) => {
  return useQuery<DocumentReview[], ServerErrorResponse>({
    queryKey: documentKeys.reviews(documentId),
    queryFn: () => getDocumentReviews(documentId),
    enabled: Boolean(documentId),
    ...options,
  });
};