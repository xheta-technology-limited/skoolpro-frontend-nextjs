import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import type { EditStaffFormData } from "../schemas/edit-staff-schema";
import { ServerErrorResponse } from "@/types/api";
import { Staff } from "../types/api/staff";

type EditStaffVariables = {
  id: string;
  data: EditStaffFormData;
};

export const editStaff = ({ id, data }: EditStaffVariables): Promise<Staff> => {
  return api.put(`staff/${id}`, data);
};

export const useEditStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<Staff, ServerErrorResponse, EditStaffVariables>({
    mutationFn: (variables) => {
      return editStaff(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};
