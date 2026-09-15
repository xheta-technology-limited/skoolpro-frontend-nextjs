import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

type DeleteStaffVariables = {
  staffId: string;
};

export const deleteStaff = ({
  staffId,
}: DeleteStaffVariables): Promise<null> => {
  return api.delete(`staff/${staffId}`);
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DeleteStaffVariables>({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};