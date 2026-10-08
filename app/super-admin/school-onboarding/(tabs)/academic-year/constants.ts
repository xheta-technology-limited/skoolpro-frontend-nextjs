import { AcademicYear } from "@/features/academic-year";

export const dummyData: AcademicYear = {
  id: "9c1a2b3c-0001-4a1b-8c2d-0000000year1",
  school_id: "0a0a0a0a-0000-4000-8000-00000000scho",
  name: "2026 / 2027",
  slug: "2026-2027",
  session_type: "term",
  session_type_label: "Term",
  starts_on: "2026-09-01",
  ends_on: "2027-07-31",
  status: "current",
  is_default_for_enrolment: true,
  generated_from_year_id: null,
  approved_at: null,
  is_draft: false,
  terms: [
    {
      id: "1a1a1a1a-0001-4000-8000-0000000term1",
      school_id: "0a0a0a0a-0000-4000-8000-00000000scho",
      academic_year_id: "9c1a2b3c-0001-4a1b-8c2d-0000000year1",
      name: "First Term",
      slug: "first-term",
      sequence: 1,
      starts_on: "2026-09-01",
      ends_on: "2026-12-15",
      status: "current",
      created_at: "2026-08-01T09:00:00+00:00",
      updated_at: "2026-08-01T09:00:00+00:00",
    },
  ],
  created_at: "2026-08-01T09:00:00+00:00",
  updated_at: "2026-08-01T09:00:00+00:00",
};

export const SESSION_TYPE_OPTIONS = [
  { value: "term", label: "Term" },
  { value: "semester", label: "Semester" },
];

export const DUMMY_CLASSES = [
  { value: "ss2", label: "SS2" },
  { value: "ss3", label: "SS3" },
];

export const DUMMY_CAMPUSES = [
  { value: "main", label: "Main Campus" },
  { value: "annex", label: "Annex Campus" },
];

export const DUMMY_CLASS_TEACHERS = [
  { value: "teacher-1", label: "Mr. John Doe" },
  { value: "teacher-2", label: "Mrs. Jane Smith" },
  { value: "teacher-3", label: "Ms. Ada Obi" },
];

export const DUMMY_CLASS_STATUSES = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];
