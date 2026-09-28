import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { countKeys } from "./query-keys";

export type PeopleCounts = {
  student_count: number;
  staff_count: number;
  guardian_count: number;
};

export const getPeopleCount = (): Promise<PeopleCounts> => {
  return api.get("people/count", { raw: true });
};

export const useGetPeopleCount = (
  options?: Partial<UseQueryOptions<PeopleCounts>>
) => {
  return useQuery<PeopleCounts>({
    queryKey: countKeys.all,
    queryFn: getPeopleCount,
    ...options,
  });
};
