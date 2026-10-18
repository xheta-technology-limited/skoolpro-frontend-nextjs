import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { passMarkKeys } from "./query-keys";
import type { CreatePassMarkFormData } from "../schemas/create-pass-mark-schema";
import { ServerErrorResponse } from "@/types/api";
import { PassMark } from "../types/api/pass-mark";

export const createPassMark = (
  data: CreatePassMarkFormData
): Promise<PassMark> => {
  return api.post("pass-marks", data);
};

export const useCreatePassMark = () => {
  const queryClient = useQueryClient();

  return useMutation<PassMark, ServerErrorResponse, CreatePassMarkFormData>({
    mutationFn: (data) => {
      return createPassMark(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passMarkKeys.all });
    },
  });
};
