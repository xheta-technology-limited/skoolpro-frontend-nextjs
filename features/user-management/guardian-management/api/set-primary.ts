import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type { GetStudentGuardiansResponse } from "../types/get-student-guardians-types";

interface SetPrimaryContactArgs {
  studentId: string;
  guardianId: string;
}

export const setPrimaryContact = ({
  studentId,
  guardianId,
}: SetPrimaryContactArgs): Promise<GetStudentGuardiansResponse> => {
  return api.post(`students/${studentId}/guardians/${guardianId}/set-primary`);
};

export const useSetPrimaryContact = () => {
  return useMutation<
    GetStudentGuardiansResponse,
    ServerErrorResponse,
    SetPrimaryContactArgs
  >({
    mutationFn: setPrimaryContact,
  });
};