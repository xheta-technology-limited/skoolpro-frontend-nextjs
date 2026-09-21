import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ServerErrorResponse } from "@/types/api";
import type { CreateEnrolmentResponse } from "../types/create-enrolment-types";

export const completeEnrolment = (
  enrolmentId: string
): Promise<CreateEnrolmentResponse["data"]> => {
  return api.post(`enrolments/${enrolmentId}/complete`);
};

export const useCompleteEnrolment = () => {
  return useMutation<
    CreateEnrolmentResponse["data"],
    ServerErrorResponse,
    string
  >({
    mutationFn: completeEnrolment,
  });
};
