import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { promotionKeys } from "./query-keys";
import { Promotion, PromotionStatus } from "../types/api/promotion";

export type GetPromotionsParams = {
  status?: PromotionStatus;
};

export const getPromotions = (
  params?: GetPromotionsParams
): Promise<Promotion[]> => {
  return api.get("promotions", { params });
};

export const useGetPromotions = (
  params?: GetPromotionsParams,
  options?: Partial<UseQueryOptions<Promotion[], ServerErrorResponse>>
) => {
  return useQuery<Promotion[], ServerErrorResponse>({
    queryFn: () => getPromotions(params),
    queryKey: params?.status
      ? promotionKeys.byStatus(params.status)
      : promotionKeys.all,
    ...options,
  });
};
