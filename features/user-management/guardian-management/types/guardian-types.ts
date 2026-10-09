export interface GuardianRecord {
  id: string;
  school_id: string;
  user_id: string | null;
  has_login: boolean;
  title: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  gender: string | null;
  photo_path: string | null;
  occupation: string | null;
  employer: string | null;
  nationality: string | null;
  phone: string | null;
  alt_phone: string | null;
  email: string | null;
  home_address: string | null;
  work_address: string | null;
  preferred_contact_method: string | null;
  preferred_language: string | null;
  children_count?: number;
  created_at: string;
  updated_at: string;
}

export interface GetGuardiansParams {
  search?: string;
  page?: number;
  per_page?: number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface GetGuardiansResponse {
  data: GuardianRecord[];
  links: PaginationLinks;
  meta: PaginationMeta;
}