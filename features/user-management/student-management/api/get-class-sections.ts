import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetClassSectionsResponse } from "../types/class-section-types";

export const getClassSections = (): Promise<GetClassSectionsResponse> => {
  return api.get("class-sections");
};

export const useGetClassSections = () => {
  return useQuery({
    queryKey: ["class-sections"],
    queryFn: getClassSections,
  });
};