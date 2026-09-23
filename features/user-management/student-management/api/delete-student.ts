import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ServerErrorResponse } from "@/types/api";

type DeleteStudentVariables = {
  studentId: string;
};

export const deleteStudent = ({
  studentId,
}: DeleteStudentVariables): Promise<null> => {
  return api.delete(`students/${studentId}`);
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteStudentVariables>({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};