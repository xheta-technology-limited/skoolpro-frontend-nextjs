import { PromotionStatus } from "../types/api/promotion";

export const promotionKeys = {
  all: ["promotions"] as const,
  detail: (id: string) => ["promotions", id] as const,
  byStatus: (status: PromotionStatus) =>
    ["promotions", "status", status] as const,
};
