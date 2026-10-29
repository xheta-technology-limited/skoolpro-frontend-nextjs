import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../documents/types/query-keys";
import type {
  DocumentRecord,
  ProfilePhotoOwnerType,
} from "../documents/types/document-types";

export const getProfilePhoto = (
  type: ProfilePhotoOwnerType,
  id: string
): Promise<DocumentRecord | null> => {
  return api.get(`documentables/${type}/${id}/profile-photo`);
};

export const useGetProfilePhoto = (
  type: ProfilePhotoOwnerType,
  id: string,
  options?: Partial<
    UseQueryOptions<DocumentRecord | null, ServerErrorResponse>
  >
) => {
  return useQuery<DocumentRecord | null, ServerErrorResponse>({
    queryKey: documentKeys.profilePhoto(type, id),
    queryFn: () => getProfilePhoto(type, id),
    enabled: Boolean(id),
    ...options,
  });
};