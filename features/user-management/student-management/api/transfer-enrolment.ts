import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type { CreateEnrolmentResponse } from "../types/create-enrolment-types";

export interface TransferEnrolmentPayload {
  class_section_id: string;
}

export interface TransferEnrolmentParams {
  enrolmentId: string;
  payload: TransferEnrolmentPayload;
}

export const transferEnrolment = (
  params: TransferEnrolmentParams
): Promise<CreateEnrolmentResponse> => {
  return api.post(
    `enrolments/${params.enrolmentId}/transfer`,
    params.payload,
    { raw: true }
  );
};

export const useTransferEnrolment = () => {
  return useMutation<
    CreateEnrolmentResponse,
    ServerErrorResponse,
    TransferEnrolmentParams
  >({
    mutationFn: transferEnrolment,
  });
};