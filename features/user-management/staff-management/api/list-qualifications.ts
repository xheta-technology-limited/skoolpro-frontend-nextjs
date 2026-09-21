import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { StaffQualification } from "../types/api/qualification";

export const listStaffQualifications = (
  staffId: string
): Promise<StaffQualification[]> => {
  return api.get(`staff/${staffId}/qualifications`);
};

export const useListStaffQualifications = (
  staffId: string,
  options?: Partial<UseQueryOptions<StaffQualification[], ServerErrorResponse>>
) => {
  return useQuery<StaffQualification[], ServerErrorResponse>({
    queryFn: () => listStaffQualifications(staffId),
    queryKey: staffKeys.qualifications(staffId),
    ...options,
  });
};