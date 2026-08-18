import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { BeginOnboardingResponse } from "../types/types";
import { ServerErrorResponse } from "@/features/auth/types/api/shared";
import { SchoolProfileFormValues } from "../school-profile-schema";

export const onboardSchool = (): Promise<BeginOnboardingResponse> => {
  return api.post("onboardings/begin");
};

export const useOnboardSchool = () => {
  return useMutation<
    BeginOnboardingResponse,
    ServerErrorResponse,
    SchoolProfileFormValues
  >({ mutationFn: onboardSchool });
};
