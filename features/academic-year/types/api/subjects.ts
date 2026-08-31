interface Stages {
  id: string;
  name: string;
  slug: string;
  code: string;
  sequence: number;
  is_active: boolean;
}
// Response type
export interface Subject {
  id: string;
  school_id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  department: string | null;
  is_active: boolean;
  intended_stages: Array<Stages>;
  created_at: string;
  updated_at: string;
}
