import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { loginRequest, loginResponse } from "../types/api";
import { authKeys } from "./query-keys";

// 1. Pure service function (strongly typed)
export const login = (data: loginRequest): Promise<loginResponse> => {
  return api.post(`/auth/spa/login`, data);
};

// 2. TanStack Query Hook
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      //TODO: add a redirect
    },
  });
};

export const getSanctumCookie = () => {
  return api.get("https://api.skoolpro.net/sanctum/csrf-cookie");
};

export const useSanctumCookie = () => {
  return useQuery({
    queryKey: authKeys.all,
    queryFn: () => getSanctumCookie(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
