import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { Payroll } from "../types/api/payroll";

export const getPayroll = (staffId: string): Promise<Payroll> =>
  api.get(`staff/${staffId}/payroll`);

export const useGetPayroll = (
  staffId: string,
  options?: Partial<UseQueryOptions<Payroll, ServerErrorResponse>>
) => {
  return useQuery<Payroll, ServerErrorResponse>({
    queryFn: () => getPayroll(staffId),
    queryKey: staffKeys.payroll(staffId),
    ...options,
  });
};