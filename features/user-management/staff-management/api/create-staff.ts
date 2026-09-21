import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import type { AddStaffFormData } from "../schemas/add-staff-schema";
import { ServerErrorResponse } from "@/types/api";

export const createStaff = (data: AddStaffFormData): Promise<{}> => {
  return api.post("staff", data);
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, ServerErrorResponse, AddStaffFormData>({
    mutationFn: (data) => {
      return createStaff(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};
