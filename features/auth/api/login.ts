import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { authKeys } from "./query-keys";
import type { LoginRequest, LoginResponse } from "../types/api/login";
import { toast } from "sonner";

export const getCsrfCookie = (): Promise<void> => {
  return api.get("https://api.skoolpro.net/sanctum/csrf-cookie");
};

export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return api.post("auth/spa/login", data);
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse,
    AxiosError<{ message: string }>,
    LoginRequest
  >({
    mutationFn: async (data) => {
      await getCsrfCookie();
      return login(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};
