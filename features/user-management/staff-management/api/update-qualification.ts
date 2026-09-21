import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import type { EditQualificationFormData } from "../schemas/edit-qualification-schema";
import { ServerErrorResponse } from "@/types/api";
import { StaffQualification } from "../types/api/qualification";

type UpdateQualificationVariables = {
  qualificationId: string;
  staffId: string;
  data: EditQualificationFormData;
};

export const updateQualification = ({
  qualificationId,
  data,
}: UpdateQualificationVariables): Promise<StaffQualification> => {
  return api.put(`staff-qualifications/${qualificationId}`, data);
};

export const useUpdateQualification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    StaffQualification,
    ServerErrorResponse,
    UpdateQualificationVariables
  >({
    mutationFn: (variables) => {
      return updateQualification(variables);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.qualifications(variables.staffId),
      });
    },
  });
};