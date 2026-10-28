import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  DocumentSignature,
  VoidSignaturePayload,
} from "../types/document-types";

interface VoidSignatureArgs {
  documentId: string;
  signatureId: string;
  payload: VoidSignaturePayload;
}

export const voidSignature = ({
  documentId,
  signatureId,
  payload,
}: VoidSignatureArgs): Promise<DocumentSignature> => {
  return api.post(
    `documents/${documentId}/signatures/${signatureId}/void`,
    payload
  );
};

export const useVoidSignature = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentSignature, ServerErrorResponse, VoidSignatureArgs>(
    {
      mutationFn: voidSignature,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: documentKeys.all }),
    }
  );
};