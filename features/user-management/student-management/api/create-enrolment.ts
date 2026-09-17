import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type {
  CreateEnrolmentPayload,
  CreateEnrolmentResponse,
} from "../types/create-enrolment-types";

export const createEnrolment = (
  payload: CreateEnrolmentPayload
): Promise<CreateEnrolmentResponse> => {
  return api.post("enrolments", payload);
};

export const useCreateEnrolment = () => {
  return useMutation<
    CreateEnrolmentResponse,
    ServerErrorResponse,
    CreateEnrolmentPayload
  >({
    mutationFn: createEnrolment,
  });
};