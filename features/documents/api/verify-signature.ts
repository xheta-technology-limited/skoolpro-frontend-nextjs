import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type { SignatureIntegrity } from "../types/document-types";

export const verifySignature = (
  documentId: string,
  signatureId: string
): Promise<SignatureIntegrity> => {
  return api.get(`documents/${documentId}/signatures/${signatureId}/verify`);
};

export const useVerifySignature = (
  documentId: string,
  signatureId: string,
  options?: Partial<UseQueryOptions<SignatureIntegrity, ServerErrorResponse>>
) => {
  return useQuery<SignatureIntegrity, ServerErrorResponse>({
    queryKey: documentKeys.signatureIntegrity(documentId, signatureId),
    queryFn: () => verifySignature(documentId, signatureId),
    enabled: Boolean(documentId) && Boolean(signatureId),
    ...options,
  });
};