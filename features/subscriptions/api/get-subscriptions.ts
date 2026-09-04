import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Subscription } from "../types/types";

export const getSubscription = (schoolId: string): Promise<Subscription> => {
  return api.get(`schools/${schoolId}/subscription`);
};

export const useGetSubscription = (schoolId: string) => {
  return useQuery({
    queryKey: ["subscription", schoolId],
    queryFn: () => getSubscription(schoolId),
    enabled: Boolean(schoolId),
  });
};