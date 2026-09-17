import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetEducationLevelsResponse } from "../types/education-level-types";

// Confirmed against the real "list-levels" GET /education/levels spec.
export const getEducationLevels = (): Promise<GetEducationLevelsResponse> => {
  return api.get("education/levels");
};

export const useGetEducationLevels = () => {
  return useQuery({
    queryKey: ["education-levels"],
    queryFn: getEducationLevels,
  });
};