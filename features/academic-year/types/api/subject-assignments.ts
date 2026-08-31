import type { Subject } from "./subjects";
import type { EducationArm } from "./arms";

export type SubjectAssignmentResponse = {
  id: string;
  school_id: string;
  subject_id: string;
  education_level_id: string;
  class_section_id: string | null;
  is_whole_level: boolean;
  is_compulsory: boolean;
  pass_mark: number;
  is_active: boolean;
  subject: {
    id: string;
    name: string;
    slug: string;
    code: string;
    department: string;
    is_active: boolean;
  };
  level: {
    id: string;
    name: string;
    slug: string;
    global_sequence: number;
  };
  section: {
    id: string;
    name: string;
    slug: string;
    arm_sequence: number;
  } | null;
  created_at: string;
  updated_at: string;
};

export type SubjectAssignment = {
  id: string;
  school_id: string;
  subject_id: string;
  education_level_id: string;
  class_section_id: string | null;
  is_whole_level: boolean;
  is_compulsory: boolean;
  pass_mark: number;
  is_active: boolean;
  subject: Subject;
  section: EducationArm | null;
  created_at: string;
  updated_at: string;
};
