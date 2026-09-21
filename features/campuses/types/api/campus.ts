export type Campus = {
  id: string;
  name: string;
  code: string | null;
  is_primary: boolean;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string;
  state_province: string | null;
  postal_code: string | null;
  country_code: string;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_status: string;
  opening_date: string | null;
  timezone: string | null;
  student_capacity: number | null;
};