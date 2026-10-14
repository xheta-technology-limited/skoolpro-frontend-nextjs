import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type {
  GetGuardiansParams,
  GetGuardiansResponse,
} from "../types/guardian-types";

export const getGuardians = (
  params: GetGuardiansParams
): Promise<GetGuardiansResponse> => {
  return api.get("guardians", { params, raw: true });
};

export const useGetGuardians = (params: GetGuardiansParams = {}) => {
  return useQuery({
    queryKey: ["guardians", params],
    queryFn: () => getGuardians(params),
  });
};