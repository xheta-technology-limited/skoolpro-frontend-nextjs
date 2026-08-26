import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import type { SchoolProfile } from "../types/school-profile";
import { schoolProfileKeys } from "./query-keys";

export type UpdateRegistrationNumberPayload = {
  country_code?: string;
  number?: string;
  issuing_authority?: string;
  expiry_date?: string | null;
};

type UpdateRegistrationNumberVariables = {
  schoolId: string;
  registrationNumberId: string;
  data: UpdateRegistrationNumberPayload;
};

export const updateRegistrationNumber = ({
  schoolId,
  registrationNumberId,
  data,
}: UpdateRegistrationNumberVariables): Promise<
  SchoolProfile["registration_numbers"][number]
> => {
  return api.put(
    `schools/${schoolId}/registration-numbers/${registrationNumberId}`,
    data
  );
};

export const useUpdateRegistrationNumber = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SchoolProfile["registration_numbers"][number],
    ServerErrorResponse,
    UpdateRegistrationNumberVariables
  >({
    mutationFn: updateRegistrationNumber,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
    },
  });
};