import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/api/forgot-password";

export const forgotPassword = (data: ForgotPasswordRequest) =>
  api.post("auth/forgot-password", data);

export const useForgotPassword = () => {
  return useMutation<
    any,
    AxiosError<{ message: string }>,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,
  });
};

export const resetPassword = (data: ResetPasswordRequest) =>
  api.post("auth/reset-password", data);
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
