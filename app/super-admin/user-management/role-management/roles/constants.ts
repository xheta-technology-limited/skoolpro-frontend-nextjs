export type FilterType =
  | { disabled: boolean; role_type?: undefined }
  | { role_type: "custom" | "system"; disabled?: undefined }
  | undefined;
