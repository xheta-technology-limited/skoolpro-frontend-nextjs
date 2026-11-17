import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleKeys } from "./query-keys";
import type { AddRestrictionFormData } from "../schemas/add-restriction-schema";
import { ServerErrorResponse } from "@/types/api";

export const addRestriction = (
  data: AddRestrictionFormData
): Promise<null> => {
  return api.post("permission-denials", data);
};

export const useAddRestriction = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, AddRestrictionFormData>({
    mutationFn: (data) => {
      return addRestriction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};
