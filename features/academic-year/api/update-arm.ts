import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { armKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { CreateArmFormData } from "../schemas/create-arm";

type UpdateArmVariables = {
  armId: string;
  level: string;
  data: CreateArmFormData;
};

export const updateArm = ({
  armId,
  data,
}: UpdateArmVariables): Promise<null> => {
  return api.put(`class-sections/${armId}`, data);
};

export const useUpdateArm = (level: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, UpdateArmVariables>({
    mutationFn: (variables) => {
      return updateArm(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: armKeys.detail(level) });
    },
  });
};
