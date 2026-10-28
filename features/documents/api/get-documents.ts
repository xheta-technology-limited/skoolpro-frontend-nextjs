import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../types/query-keys";
import type {
  DocumentableType,
  GetDocumentsParams,
  GetDocumentsResponse,
} from "../types/document-types";

export const getDocuments = (
  type: DocumentableType,
  id: string,
  params: GetDocumentsParams = {}
): Promise<GetDocumentsResponse> => {
  return api.get(`documentables/${type}/${id}/documents`, {
    params,
    raw: true,
  });
};

export const useGetDocuments = (
  type: DocumentableType,
  id: string,
  params: GetDocumentsParams = {},
  options?: Partial<UseQueryOptions<GetDocumentsResponse, ServerErrorResponse>>
) => {
  return useQuery<GetDocumentsResponse, ServerErrorResponse>({
    queryKey: documentKeys.list(type, id, params),
    queryFn: () => getDocuments(type, id, params),
    enabled: Boolean(id),
    ...options,
  });
};