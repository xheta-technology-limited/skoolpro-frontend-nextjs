import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { authKeys } from "./query-keys";
import type { LoginRequest, LoginResponse } from "../types/api/login";
import { ServerErrorResponse } from "../types/api/shared";

export const getCsrfCookie = (): Promise<void> => {
  return api.get("/sanctum/csrf-cookie");
};

export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return api.post("auth/spa/login", data);
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ServerErrorResponse, LoginRequest>({
    mutationFn: async (data) => {
      await getCsrfCookie();
      return login(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};
