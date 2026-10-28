import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  ApproveDocumentPayload,
  DocumentRecord,
} from "../types/document-types";

interface ApproveDocumentArgs {
  documentId: string;
  payload?: ApproveDocumentPayload;
}

export const approveDocument = ({
  documentId,
  payload = {},
}: ApproveDocumentArgs): Promise<DocumentRecord> => {
  return api.post(`documents/${documentId}/approve`, payload);
};

export const useApproveDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, ApproveDocumentArgs>({
    mutationFn: approveDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};