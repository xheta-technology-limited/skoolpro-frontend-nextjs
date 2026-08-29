import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AcademicYear } from "../types/api/academic-year";
import { authKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

export const getAcademicYears = (): Promise<AcademicYear[]> => {
  return api.get("academic-years");
};

export const useGetAcademicYears = () => {
  return useQuery<AcademicYear[], ServerErrorResponse>({
    queryFn: getAcademicYears,
    queryKey: authKeys.all,
  });
};
