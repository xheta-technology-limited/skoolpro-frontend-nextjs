import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ServerErrorResponse } from "@/types/api";
import type { CreateEnrolmentResponse } from "../types/create-enrolment-types";

export const withdrawEnrolment = (
  enrolmentId: string
): Promise<CreateEnrolmentResponse["data"]> => {
  return api.post(`enrolments/${enrolmentId}/withdraw`);
};

export const useWithdrawEnrolment = () => {
  return useMutation<
    CreateEnrolmentResponse["data"],
    ServerErrorResponse,
    string
  >({
    mutationFn: withdrawEnrolment,
  });
};
