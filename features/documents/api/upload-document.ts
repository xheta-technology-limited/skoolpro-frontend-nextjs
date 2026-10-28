import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  DocumentRecord,
  DocumentableType,
  UploadDocumentPayload,
} from "../types/document-types";

interface UploadDocumentArgs {
  type: DocumentableType;
  id: string;
  payload: UploadDocumentPayload;
}

export const uploadDocument = ({
  type,
  id,
  payload,
}: UploadDocumentArgs): Promise<DocumentRecord> => {
  const body = new FormData();
  body.append("file", payload.file);
  body.append("purpose", payload.purpose);
  if (payload.title) body.append("title", payload.title);
  if (payload.confidentiality_level) {
    body.append("confidentiality_level", payload.confidentiality_level);
  }
  if (payload.expiry_date) body.append("expiry_date", payload.expiry_date);

  return api.post(`documentables/${type}/${id}/documents`, body);
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, UploadDocumentArgs>({
    mutationFn: uploadDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};