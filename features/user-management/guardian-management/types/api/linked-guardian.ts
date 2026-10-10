export interface LinkedGuardian {
  user_id: string | null;
  email: string | null;
  roles: string[];
  must_change_password: boolean;
  is_linked: boolean;
}