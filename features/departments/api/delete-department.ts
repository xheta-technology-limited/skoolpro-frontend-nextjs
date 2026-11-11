import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { departmentKeys } from "./query-keys";

/** Delete a department by id. */
export const deleteDepartment = (id: string): Promise<null> => {
  return api.delete(`departments/${id}`);
};

/** Mutation hook that deletes a department and refreshes department queries. */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, string>({
    mutationFn: (id) => {
      return deleteDepartment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
