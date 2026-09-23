import { z } from "zod";

// TODO: swap for a real generator (likely a backend call keyed off school
// year + a running sequence) once that endpoint exists.
export function generateAdmissionNumber() {
  const year = new Date().getFullYear();
  const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
  return `${year}/${sequence}`;
}

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

// TODO: replace all of these with real data from the backend — none of
// this is confirmed, just enough to match the reference design's layout.
export const ADMISSION_TYPE_OPTIONS = [
  { label: "New admission", value: "new" },
  { label: "Transfer", value: "transfer" },
  { label: "Re-admission", value: "re_admission" },
];

export const CLASS_OPTIONS = [
  { label: "JS1", value: "js1" },
  { label: "JS2", value: "js2" },
  { label: "JS3", value: "js3" },
];

export const ACADEMIC_YEAR_OPTIONS = [
  { label: "2025/2026", value: "2025-2026" },
  { label: "2026/2027", value: "2026-2027" },
];

export const admitStudentSchema = z.object({
  // Step 1 — admission number & IDs
  admissionNumber: z.string().min(1, "Admission number is required"),
  studentId: z.string().optional(),
  previousAdmissionNo: z.string().optional(),
  // Step 1 — student details
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().optional(),
  countryOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  firstLanguage: z.string().optional(),
  otherLanguage: z.string().optional(),
  photoId: z.instanceof(File).nullable(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  // Step 2 — contact details
  houseAddress: z.string().optional(),
  studentEmail: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional(),
  // Step 2 — academic details
  classToEnroll: z.string().min(1, "Class to enroll in is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  admissionType: z.string().optional(),
  previousSchoolAttended: z.string().optional(),
  entranceExamResult: z.string().optional(),
  interviewResult: z.string().optional(),
  // Step 2 — enroll into class
  enrollmentMode: z.enum(["enroll", "admit_only"]),
  academicYear: z.string().optional(),
  classSection: z.string().optional(),
  rollNumber: z.string().optional(),
});

export type AdmitStudentValues = z.infer<typeof admitStudentSchema>;

export const STEP_ONE_FIELDS = [
  "admissionNumber",
  "studentId",
  "previousAdmissionNo",
  "firstName",
  "middleName",
  "lastName",
  "preferredName",
  "gender",
  "dateOfBirth",
  "nationality",
  "countryOfBirth",
  "placeOfBirth",
  "firstLanguage",
  "otherLanguage",
  "photoId",
  "religion",
  "ethnicity",
] as const;

export const DEFAULT_ADMIT_STUDENT_VALUES: AdmitStudentValues = {
  admissionNumber: "",
  studentId: "",
  previousAdmissionNo: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  gender: "",
  dateOfBirth: "",
  nationality: "",
  countryOfBirth: "",
  placeOfBirth: "",
  firstLanguage: "",
  otherLanguage: "",
  photoId: null,
  religion: "",
  ethnicity: "",
  houseAddress: "",
  studentEmail: "",
  phoneNumber: "",
  classToEnroll: "",
  admissionDate: "",
  admissionType: "",
  previousSchoolAttended: "",
  entranceExamResult: "",
  interviewResult: "",
  enrollmentMode: "enroll",
  academicYear: "",
  classSection: "",
  rollNumber: "",
};