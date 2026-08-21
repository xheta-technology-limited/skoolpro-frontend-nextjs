import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateSubscriptionParams,
  CreateSubscriptionResponse,
} from "../types/api";
import { ServerErrorResponse } from "@/features/auth/types/api/shared";

export const createSubscription = (
  param: CreateSubscriptionParams
): Promise<CreateSubscriptionResponse> => {
  return api.post(`schools/${param.schoolId}/subscription`, param.payload);
};

export const useCreateSubscription = () => {
  return useMutation<
    CreateSubscriptionResponse,
    ServerErrorResponse,
    CreateSubscriptionParams
  >({ mutationFn: createSubscription });
};
