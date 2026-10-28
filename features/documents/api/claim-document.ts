import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type { DocumentRecord } from "../types/document-types";

interface ClaimDocumentArgs {
  documentId: string;
}

export const claimDocument = ({
  documentId,
}: ClaimDocumentArgs): Promise<DocumentRecord> => {
  return api.post(`documents/${documentId}/claim`);
};

export const useClaimDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, ClaimDocumentArgs>({
    mutationFn: claimDocument,
    // Every review action can change the queue, the owner lists, the
    // document's history and its signatures, so refresh them all.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};