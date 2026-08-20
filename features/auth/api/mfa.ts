import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  AuthenticatorConfirmResponse,
  AuthenticatorSetupResponse,
  VerifyMfaRequest,
  VerifyMfaResponse,
} from "../types/api/mfa";
import { AxiosError } from "axios";
import { MFAMethod } from "../types/types";
import { LoginData } from "../types/api/login";
import { ServerErrorResponse } from "../types/api/shared";

//setup mfa
export const authenticatorSetup = (): Promise<AuthenticatorSetupResponse> => {
  return api.post("mfa/authenticator/setup");
};
export const useAuthenticatorSetup = () => {
  return useMutation<AuthenticatorSetupResponse, ServerErrorResponse, {}>({
    mutationFn: authenticatorSetup,
  });
};

// confirm mfa
export const confirmMfaCode = (data: {
  code: string;
}): Promise<AuthenticatorConfirmResponse> => {
  return api.post("mfa/authenticator/confirm", data);
};

export const useConfirmMfaCode = () => {
  return useMutation<
    AuthenticatorConfirmResponse,
    ServerErrorResponse,
    { code: string }
  >({
    mutationFn: confirmMfaCode,
  });
};

// setup otp
export const otpSetup = (data: {
  method: MFAMethod;
}): Promise<{ message: string }> => {
  return api.post("mfa/otp/request", data);
};

export const useOtpSetup = () => {
  return useMutation<
    { message: string },
    ServerErrorResponse,
    { method: MFAMethod }
  >({
    mutationFn: otpSetup,
  });
};

export const confirmOtp = (data: {
  method: string;
  code: string;
}): Promise<{ message: string }> => {
  return api.post("mfa/otp/confirm", data);
};

export const useConfirmOtp = () => {
  return useMutation<
    { message: string },
    ServerErrorResponse,
    { method: string; code: string }
  >({
    mutationFn: confirmOtp,
  });
};

//verify mfa
export const verifyMFA = (body: VerifyMfaRequest): Promise<LoginData> => {
  return api.post("auth/spa/mfa/verify", body);
};
export const useVerifyMFA = () => {
  return useMutation<LoginData, ServerErrorResponse, VerifyMfaRequest>({
    mutationFn: verifyMFA,
  });
};
