import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetGuardianResponse } from "../types/guardian-detail-types";

export const getGuardian = (guardianId: string): Promise<GetGuardianResponse> => {
  return api.get(`guardians/${guardianId}`);
};

export const useGetGuardian = (guardianId: string) => {
  return useQuery({
    queryKey: ["guardians", guardianId],
    queryFn: () => getGuardian(guardianId),
    enabled: Boolean(guardianId),
  });
};