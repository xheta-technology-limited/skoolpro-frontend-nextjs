import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BeginOnboardingResponse } from "../types/types";
import { ServerErrorResponse } from "@/features/auth/types/api/shared";
import { SchoolProfileFormValues } from "../school-profile-schema";

export const onboardSchool = (
  data: SchoolProfileFormValues
): Promise<BeginOnboardingResponse> => {
  return api.post("onboardings/begin", data);
};

export const useOnboardSchool = () => {
  return useMutation<
    BeginOnboardingResponse,
    ServerErrorResponse,
    SchoolProfileFormValues
  >({ mutationFn: onboardSchool });
};

export const getPlans = () => {
  return api.get("catalog/plans");
};

export const useGetPlans = () => {
  return useQuery({ queryFn: getPlans, queryKey: ["sub-plans"] });
};
