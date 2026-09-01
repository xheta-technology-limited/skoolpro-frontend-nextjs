import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AcademicYear } from "../types/api/academic-year";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { useEffect } from "react";
import { useAcademicYearStore } from "../academic-year.store";

export const getAcademicYears = (): Promise<AcademicYear[]> => {
  return api.get("academic-years");
};

export const useGetAcademicYears = () => {
  const query = useQuery<AcademicYear[], ServerErrorResponse>({
    queryFn: getAcademicYears,
    queryKey: academicYearKeys.all,
  });
  const setLastAcademicYear = useAcademicYearStore(
    (state) => state.setLastAcademicYear
  );

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setLastAcademicYear(query.data[query.data.length - 1]);
    }
  }, [query.data]);

  return query;
};
