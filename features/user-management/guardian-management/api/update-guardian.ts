import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type { EditGuardianFormData } from "../schemas/edit-guardian-schema";
import type { GuardianRecord } from "../types/guardian-types";

export type UpdateGuardianPayload = {
  [K in keyof EditGuardianFormData]: EditGuardianFormData[K] | null;
};

interface UpdateGuardianArgs {
  guardianId: string;
  payload: UpdateGuardianPayload;
}

export const updateGuardian = ({
  guardianId,
  payload,
}: UpdateGuardianArgs): Promise<GuardianRecord> => {
  return api.put(`guardians/${guardianId}`, payload);
};

export const useUpdateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation<GuardianRecord, ServerErrorResponse, UpdateGuardianArgs>({
    mutationFn: updateGuardian,
    onSuccess: (_data, {guardianId}) =>
      queryClient.invalidateQueries({ queryKey: ["guardians", guardianId] }),
  });
};