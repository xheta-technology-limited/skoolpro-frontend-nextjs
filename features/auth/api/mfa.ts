import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  AuthenticatorConfirmResponse,
  AuthenticatorSetupResponse,
} from "../types/api/mfa";
import { AxiosError } from "axios";

//setup mfa
export const authenticatorSetup = (): Promise<AuthenticatorSetupResponse> => {
  return api.post("/mfa/authenticator/setup");
};
export const useAuthenticatorSetup = () => {
  return useMutation<
    AuthenticatorSetupResponse,
    AxiosError<{ message: string }>,
    {}
  >({ mutationFn: authenticatorSetup });
};

// confirm mfa
export const confirmMfaCode = (data: {
  code: string;
}): Promise<AuthenticatorConfirmResponse> => {
  return api.post("/mfa/authenticator/confirm", data);
};

export const useConfirmMfaCode = () => {
  return useMutation<
    AuthenticatorConfirmResponse,
    AxiosError<{ message: string }>,
    { code: string }
  >({
    mutationFn: confirmMfaCode,
  });
};

// setup otp
export const otpSetup = (): Promise<{ message: string }> => {
  return api.post("/mfa/otp/request");
};

export const useOtpSetup = () => {
  return useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    { method: string }
  >({
    mutationFn: otpSetup,
  });
};
