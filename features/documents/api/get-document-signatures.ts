import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type { DocumentSignature } from "../types/document-types";

export const getDocumentSignatures = (
  documentId: string
): Promise<DocumentSignature[]> => {
  return api.get(`documents/${documentId}/signatures`);
};

export const useGetDocumentSignatures = (
  documentId: string,
  options?: Partial<UseQueryOptions<DocumentSignature[], ServerErrorResponse>>
) => {
  return useQuery<DocumentSignature[], ServerErrorResponse>({
    queryKey: documentKeys.signatures(documentId),
    queryFn: () => getDocumentSignatures(documentId),
    enabled: Boolean(documentId),
    ...options,
  });
};