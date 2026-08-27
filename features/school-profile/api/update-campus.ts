import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import type { SchoolProfile } from "../types/school-profile";
import { schoolProfileKeys } from "./query-keys";

export type UpdateCampusPayload = {
  name?: string;
  code?: string | null;
  is_primary?: boolean;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string;
  state_province?: string | null;
  postal_code?: string | null;
  country_code?: string;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string;
  student_capacity?: number | null;
};

type UpdateCampusVariables = {
  schoolId: string;
  campusId: string;
  data: UpdateCampusPayload;
};

export const updateCampus = ({
  schoolId,
  campusId,
  data,
}: UpdateCampusVariables): Promise<SchoolProfile["campuses"][number]> => {
  return api.put(`schools/${schoolId}/campuses/${campusId}`, data);
};

export const useUpdateCampus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SchoolProfile["campuses"][number],
    ServerErrorResponse,
    UpdateCampusVariables
  >({
    mutationFn: updateCampus,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
    },
  });
};