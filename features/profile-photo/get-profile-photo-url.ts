import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../documents/types/query-keys";
import type {
  ProfilePhotoOwnerType,
  ProfilePhotoUrl,
} from "../documents/types/document-types";

export const getProfilePhotoUrl = (
  type: ProfilePhotoOwnerType,
  id: string
): Promise<ProfilePhotoUrl> => {
  return api.get(`documentables/${type}/${id}/profile-photo/url`);
};

export const useGetProfilePhotoUrl = (
  type: ProfilePhotoOwnerType,
  id: string,
  options?: Partial<UseQueryOptions<ProfilePhotoUrl, ServerErrorResponse>>
) => {
  return useQuery<ProfilePhotoUrl, ServerErrorResponse>({
    queryKey: documentKeys.profilePhotoUrl(type, id),
    queryFn: () => getProfilePhotoUrl(type, id),
    enabled: Boolean(id),
    ...options,
  });
};