import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { promotionKeys } from "./query-keys";
import { PromotionDetails } from "../types/api/promotion-details";

interface PromotionDetailsResponse {
  data: PromotionDetails[];
  meta: {
    total: number;
    needs_placement: number;
    graduating: number;
  };
}

export const getPromotionDetails = (
  promotionId: string
): Promise<PromotionDetailsResponse> => {
  return api.get(`promotions/${promotionId}/preview`, { raw: true });
};

export const useGetPromotionDetails = (
  promotionId: string,
  options?: Partial<UseQueryOptions<PromotionDetailsResponse, ServerErrorResponse>>
) => {
  return useQuery<PromotionDetailsResponse, ServerErrorResponse>({
    queryFn: () => getPromotionDetails(promotionId),
    queryKey: promotionKeys.preview(promotionId),
    ...options,
  });
};