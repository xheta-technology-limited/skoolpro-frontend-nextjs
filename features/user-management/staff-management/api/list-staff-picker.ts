import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";

export type StaffPickerOption = {
  id: string;
  first_name: string;
  last_name: string;
};

export const listStaffPicker = (): Promise<StaffPickerOption[]> =>
  api.get("staff/list-picker");

export const useListStaffPicker = (
  options?: Partial<UseQueryOptions<StaffPickerOption[], ServerErrorResponse>>
) => {
  return useQuery<StaffPickerOption[], ServerErrorResponse>({
    queryFn: listStaffPicker,
    queryKey: staffKeys.picker,
    ...options,
  });
};
