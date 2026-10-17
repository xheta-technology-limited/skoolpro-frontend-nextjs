import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { promotionRuleKeys } from "./query-keys";
import { PromotionRule } from "../types/api/promotion-rule";

export const listPromotionRules = (): Promise<PromotionRule[]> =>
  api.get("promotion-rules");

export const useListPromotionRules = (
  options?: Partial<UseQueryOptions<PromotionRule[], ServerErrorResponse>>
) => {
  return useQuery<PromotionRule[], ServerErrorResponse>({
    queryFn: listPromotionRules,
    queryKey: promotionRuleKeys.all,
    ...options,
  });
};
