import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type { DocumentRecord } from "../types/document-types";

interface ReleaseDocumentArgs {
  documentId: string;
}

export const releaseDocument = ({
  documentId,
}: ReleaseDocumentArgs): Promise<DocumentRecord> => {
  return api.post(`documents/${documentId}/release`);
};

export const useReleaseDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, ReleaseDocumentArgs>({
    mutationFn: releaseDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};