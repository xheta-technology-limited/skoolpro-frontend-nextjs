import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { resetAllStores } from "@/lib/store-registry";

export const logout = (): Promise<void> => {
  return api.post("/logout");
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ServerErrorResponse, void>({
    mutationFn: logout,
    onSuccess: () => {
      resetAllStores();
      queryClient.clear();
    },
  });
};
