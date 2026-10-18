import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type {
  CreateGuardianPayload,
  CreateGuardianResponse,
} from "../types/create-guardian-types";

export const createGuardian = (
  payload: CreateGuardianPayload
): Promise<CreateGuardianResponse> => {
  return api.post("guardians", payload);
};

export const useCreateGuardian = () => {
  return useMutation<
    CreateGuardianResponse,
    ServerErrorResponse,
    CreateGuardianPayload
  >({
    mutationFn: createGuardian,
  });
};