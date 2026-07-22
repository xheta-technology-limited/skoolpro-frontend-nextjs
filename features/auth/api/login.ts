import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { loginResponse } from "../types/api";
import { authKeys } from "./query-keys";

// 1. Pure service function (strongly typed)
export const login = (): Promise<loginResponse> => {
  return api.get(`/auth/spa/login`);
};

// 2. TanStack Query Hook
export const useLogin = () => {
  return useQuery({
    queryKey: authKeys.all,
    queryFn: () => login(),
  });
};
