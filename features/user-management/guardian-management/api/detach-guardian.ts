import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";

interface DetachGuardianArgs {
  studentId: string;
  guardianId: string;
}

export const detachGuardian = ({
  studentId,
  guardianId,
}: DetachGuardianArgs): Promise<void> => {
  return api.delete(`students/${studentId}/guardians/${guardianId}`);
};

export const useDetachGuardian = () => {
  return useMutation<void, ServerErrorResponse, DetachGuardianArgs>({
    mutationFn: detachGuardian,
  });
};