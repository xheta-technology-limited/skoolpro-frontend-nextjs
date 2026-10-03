import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { promotionKeys } from "./query-keys";
import type { CommitPromotionFormData } from "../schemas/commit-promotion-schema";
import { ServerErrorResponse } from "@/types/api";
import { Promotion } from "../types/api/promotion";

type CommitPromotionVariables = {
  promotionId: string;
  data: CommitPromotionFormData;
};

export const commitPromotion = ({
  promotionId,
  data,
}: CommitPromotionVariables): Promise<Promotion> => {
  return api.post(`promotions/${promotionId}/commit`, data);
};

export const useCommitPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Promotion,
    ServerErrorResponse,
    CommitPromotionVariables
  >({
    mutationFn: (variables) => {
      return commitPromotion(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
};