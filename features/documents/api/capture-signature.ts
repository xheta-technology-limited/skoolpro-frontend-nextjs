import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  CaptureSignaturePayload,
  DocumentSignature,
} from "../types/document-types";

interface CaptureSignatureArgs {
  documentId: string;
  payload: CaptureSignaturePayload;
}


export const captureSignature = ({
  documentId,
  payload,
}: CaptureSignatureArgs): Promise<DocumentSignature> => {
  const url = `documents/${documentId}/signatures`;

  if (payload.method === "drawn" || payload.method === "uploaded") {
    const body = new FormData();
    body.append("method", payload.method);
    body.append("signer_name", payload.signer_name);
    if (payload.signer_capacity) {
      body.append("signer_capacity", payload.signer_capacity);
    }
    if (payload.signer_user_id) {
      body.append("signer_user_id", payload.signer_user_id);
    }
    body.append(
      "image",
      payload.image,
      payload.image instanceof File ? payload.image.name : "signature.png"
    );
    return api.post(url, body);
  }

  return api.post(url, payload);
};

export const useCaptureSignature = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DocumentSignature,
    ServerErrorResponse,
    CaptureSignatureArgs
  >({
    mutationFn: captureSignature,
    // A signature can unblock approval, so refresh the document views
    // too, not just the signature list.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
};