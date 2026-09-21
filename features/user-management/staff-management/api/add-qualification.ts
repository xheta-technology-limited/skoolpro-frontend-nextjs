import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import type { QualificationFormData } from "../schemas/add-qualification-schema";
import { ServerErrorResponse } from "@/types/api";
import { StaffQualification } from "../types/api/qualification";

type AddQualificationVariables = {
  staffId: string;
  data: QualificationFormData;
};

export const addQualification = ({
  staffId,
  data,
}: AddQualificationVariables): Promise<StaffQualification> => {
  return api.post(`staff/${staffId}/qualifications`, data);
};

export const useAddQualification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    StaffQualification,
    ServerErrorResponse,
    AddQualificationVariables
  >({
    mutationFn: (variables) => {
      return addQualification(variables);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.qualifications(variables.staffId),
      });
    },
  });
};