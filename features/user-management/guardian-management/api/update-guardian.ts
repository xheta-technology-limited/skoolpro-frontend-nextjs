import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type { EditGuardianFormData } from "../schemas/edit-guardian-schema";
import type { GuardianRecord } from "../types/guardian-types";

interface UpdateGuardianArgs {
  guardianId: string;
  payload: EditGuardianFormData;
}

export const updateGuardian = ({
  guardianId,
  payload,
}: UpdateGuardianArgs): Promise<GuardianRecord> => {
  return api.put(`guardians/${guardianId}`, payload);
};

export const useUpdateGuardian = () => {
  return useMutation<GuardianRecord, ServerErrorResponse, UpdateGuardianArgs>({
    mutationFn: updateGuardian,
  });
};