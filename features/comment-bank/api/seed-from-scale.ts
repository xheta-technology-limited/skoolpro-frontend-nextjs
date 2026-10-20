import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { commentKeys } from "./query-keys";
import type { SeedFromScaleFormData } from "../schemas/seed-from-scale-schema";
import { ServerErrorResponse } from "@/types/api";

interface SeedFromScaleResponse {
  created: number;
}

export const seedFromScale = (
  data: SeedFromScaleFormData
): Promise<SeedFromScaleResponse> => {
  return api.post("comment-bank/seed-from-grade-scale", data);
};

export const useSeedFromScale = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SeedFromScaleResponse,
    ServerErrorResponse,
    SeedFromScaleFormData
  >({
    mutationFn: (data) => {
      return seedFromScale(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};
