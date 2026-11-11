import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";

export type StaffPickerOption = {
  id: string;
  first_name: string;
  last_name: string;
};

/** Fetch the unpaginated staff options used by pickers. */
export const listStaffPicker = (): Promise<StaffPickerOption[]> =>
  api.get("staff/list-picker");

/** Query hook for the unpaginated staff picker options. */
export const useListStaffPicker = (
  options?: Partial<UseQueryOptions<StaffPickerOption[], ServerErrorResponse>>
) => {
  return useQuery<StaffPickerOption[], ServerErrorResponse>({
    queryFn: listStaffPicker,
    queryKey: staffKeys.picker,
    ...options,
  });
};
