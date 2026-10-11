import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ServerErrorResponse } from "@/types/api";

type DeleteGuardianVariables = {
  guardianId: string;
};

export const deleteGuardian = ({
  guardianId,
}: DeleteGuardianVariables): Promise<null> => {
  return api.delete(`guardians/${guardianId}`);
};

export const useDeleteGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteGuardianVariables>({
    mutationFn: deleteGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
    },
  });
};