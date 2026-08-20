import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { SchoolPlan } from "../types/types";

export const getPlans = (): Promise<SchoolPlan[]> => {
  return api.get("catalog/plans");
};

export const useGetPlans = () => {
  return useQuery({ queryFn: getPlans, queryKey: ["sub-plans"] });
};
