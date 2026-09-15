import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { TeacherProfile } from "../types/api/teaching-profile";

export type UpdateTeachingProfileData = Partial<
  Omit<TeacherProfile, "id" | "staff_id">
>;

type UpdateTeachingProfileVariables = {
  staffId: string;
  data: UpdateTeachingProfileData;
};

export const updateTeachingProfile = ({
  staffId,
  data,
}: UpdateTeachingProfileVariables): Promise<TeacherProfile> => {
  return api.put(`staff/${staffId}/teaching-profile`, data);
};

export const useUpdateTeachingProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TeacherProfile,
    ServerErrorResponse,
    UpdateTeachingProfileVariables
  >({
    mutationFn: (variables) => {
      return updateTeachingProfile(variables);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.teachingProfile(variables.staffId),
      });
    },
  });
};