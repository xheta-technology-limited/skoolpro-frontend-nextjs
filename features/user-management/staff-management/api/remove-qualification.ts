import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { StaffQualification } from "../types/api/qualification";

type RemoveQualificationVariables = {
  staffId: string;
  qualificationId: string;
};

export const removeQualification = ({
  qualificationId,
}: RemoveQualificationVariables): Promise<StaffQualification> => {
  return api.delete(`staff-qualifications/${qualificationId}`);
};

export const useRemoveQualification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    StaffQualification,
    ServerErrorResponse,
    RemoveQualificationVariables
  >({
    mutationFn: (variables) => {
      return removeQualification(variables);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.qualifications(variables.staffId),
      });
    },
  });
};
