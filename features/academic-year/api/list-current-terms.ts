import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { academicTermKeys } from "./query-keys";
import { Term } from "../types/api/terms";

export const listCurrentTerms = (): Promise<Term[]> =>
  api.get("academic-years/current/terms");

export const useListCurrentTerms = (
  options?: Partial<UseQueryOptions<Term[], ServerErrorResponse>>
) => {
  return useQuery<Term[], ServerErrorResponse>({
    queryFn: listCurrentTerms,
    queryKey: academicTermKeys.current,
    ...options,
  });
};
