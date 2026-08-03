export type UserStore = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  username: string;
  phone: string | null;
  active_role: string;
  active_school_id: string | null;
  profile_image: string | null;
  account_activated: number;
  is_staff: number;
  status: string;
};
