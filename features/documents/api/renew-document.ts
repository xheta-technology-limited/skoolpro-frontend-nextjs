import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  DocumentRecord,
  RenewDocumentPayload,
} from "../types/document-types";

interface RenewDocumentArgs {
  documentId: string;
  payload: RenewDocumentPayload;
}

export const renewDocument = ({
  documentId,
  payload,
}: RenewDocumentArgs): Promise<DocumentRecord> => {
  const body = new FormData();
  body.append("file", payload.file);
  if (payload.title) body.append("title", payload.title);
  if (payload.confidentiality_level) {
    body.append("confidentiality_level", payload.confidentiality_level);
  }
  if (payload.expiry_date) body.append("expiry_date", payload.expiry_date);

  return api.post(`documents/${documentId}/renew`, body);
};

export const useRenewDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, RenewDocumentArgs>({
    mutationFn: renewDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};