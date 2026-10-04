import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { promotionKeys } from "./query-keys";
import { Promotion } from "../types/api/promotion";

export const getSinglePromotion = (id: string): Promise<Promotion> => {
  return api.get(`promotions/${id}`);
};

export const useGetSinglePromotion = (
  id: string,
  options?: Partial<UseQueryOptions<Promotion, ServerErrorResponse>>
) => {
  return useQuery<Promotion, ServerErrorResponse>({
    queryFn: () => getSinglePromotion(id),
    queryKey: promotionKeys.detail(id),
    ...options,
  });
};
