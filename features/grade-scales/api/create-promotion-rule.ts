import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { promotionRuleKeys } from "./query-keys";
import type { CreatePromotionRuleFormData } from "../schemas/create-promotion-rule-schema";
import { ServerErrorResponse } from "@/types/api";
import { PromotionRule } from "../types/api/promotion-rule";

type CreatePromotionRulePayload = {
  scope: CreatePromotionRuleFormData["scope"];
  education_stage_id?: string;
  education_level_id?: string;
  minimum_average?: number;
  require_all_compulsory?: boolean;
  required_subject_assignment_ids?: string[];
  attendance_requirement?: number;
  auto_promote?: boolean;
  graduation_minimum_average?: number;
};

const toNumber = (value?: string) => {
  if (value === undefined || value.trim() === "") return undefined;
  return Number(value);
};

export const createPromotionRule = (
  data: CreatePromotionRuleFormData
): Promise<PromotionRule> => {
  const payload: CreatePromotionRulePayload = {
    ...data,
    minimum_average: toNumber(data.minimum_average),
    attendance_requirement: toNumber(data.attendance_requirement),
    graduation_minimum_average: toNumber(data.graduation_minimum_average),
  };
  return api.post("promotion-rules", payload);
};

export const useCreatePromotionRule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PromotionRule,
    ServerErrorResponse,
    CreatePromotionRuleFormData
  >({
    mutationFn: (data) => {
      return createPromotionRule(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionRuleKeys.all });
    },
  });
};
