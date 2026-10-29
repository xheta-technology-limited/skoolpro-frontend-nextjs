import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  DocumentRecord,
  RejectDocumentPayload,
} from "../types/document-types";

interface RejectDocumentArgs {
  documentId: string;
  payload: RejectDocumentPayload;
}

export const rejectDocument = ({
  documentId,
  payload,
}: RejectDocumentArgs): Promise<DocumentRecord> => {
  return api.post(`documents/${documentId}/reject`, payload);
};

export const useRejectDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, RejectDocumentArgs>({
    mutationFn: rejectDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};