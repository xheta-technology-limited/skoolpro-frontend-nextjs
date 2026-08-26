import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { SchoolProfile } from "../types/school-profile";
import { schoolProfileKeys } from "./query-keys";

export type UpdateSchoolProfilePayload = {
  display_name?: string;
  motto?: string;
  description?: string;
  ownership_type?: string;
  founding_date?: string;
  type_slugs?: string[];
};

type UpdateSchoolProfileVariables = {
  schoolId: string;
  data: UpdateSchoolProfilePayload;
};

export const updateSchoolProfile = ({
  schoolId,
  data,
}: UpdateSchoolProfileVariables): Promise<SchoolProfile> => {
  return api.put(`schools/${schoolId}`, data);
};

export const useUpdateSchoolProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SchoolProfile,
    ServerErrorResponse,
    UpdateSchoolProfileVariables
  >({
    mutationFn: updateSchoolProfile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
    },
  });
};