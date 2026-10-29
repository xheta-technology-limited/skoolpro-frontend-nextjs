import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { documentKeys } from "../documents/types/query-keys";
import type {
  DocumentRecord,
  ProfilePhotoOwnerType,
  SetProfilePhotoPayload,
} from "../documents/types/document-types";

interface SetProfilePhotoArgs {
  type: ProfilePhotoOwnerType;
  id: string;
  payload: SetProfilePhotoPayload;
}

export const setProfilePhoto = ({
  type,
  id,
  payload,
}: SetProfilePhotoArgs): Promise<DocumentRecord> => {
  const body = new FormData();
  body.append("file", payload.file);
  if (payload.confidentiality_level) {
    body.append("confidentiality_level", payload.confidentiality_level);
  }

  return api.post(`documentables/${type}/${id}/profile-photo`, body);
};

const OWNER_DETAIL_KEYS: Partial<Record<ProfilePhotoOwnerType, string>> = {
  student: "students",
  guardian: "guardians",
  staff: "staff",
};

export const useSetProfilePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentRecord, ServerErrorResponse, SetProfilePhotoArgs>({
    mutationFn: setProfilePhoto,
    onSuccess: (_data, { type, id }) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      const detailKey = OWNER_DETAIL_KEYS[type];
      if (detailKey) {
        queryClient.invalidateQueries({ queryKey: [detailKey, id] });
      }
    },
  });
};