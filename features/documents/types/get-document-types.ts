import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "./query-keys";
import type { DocumentTypesMap } from "../types/document-types";


export const getDocumentTypes = (): Promise<DocumentTypesMap> => {
  return api.get("documentables/types");
};

export const useGetDocumentTypes = (
  options?: Partial<UseQueryOptions<DocumentTypesMap, ServerErrorResponse>>
) => {
  return useQuery<DocumentTypesMap, ServerErrorResponse>({
    queryKey: documentKeys.types(),
    queryFn: getDocumentTypes,
    ...options,
  });
};