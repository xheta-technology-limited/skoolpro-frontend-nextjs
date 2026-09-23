import { z } from "zod";

import type { UpdateStudentPayload } from "../api/update-student";

export const editStudentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional().nullable(),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  place_of_birth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  country_of_birth: z.string().optional().nullable(),
  first_language: z.string().optional().nullable(),
  other_languages: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),
  ethnicity: z.string().optional().nullable(),
  personal_email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .nullable()
    .or(z.literal("")),
  personal_phone: z.string().optional().nullable(),
  home_address: z.string().optional().nullable(),
  mailing_address: z.string().optional().nullable(),
  current_residential_address: z.string().optional().nullable(),
  admission_date: z.string().optional(),
  admission_type: z.string().optional().nullable(),
  previous_school: z.string().optional().nullable(),
  reason_for_leaving_previous_school: z.string().optional().nullable(),
  entrance_exam_result: z.string().optional().nullable(),
  interview_result: z.string().optional().nullable(),
});

export type EditStudentFormData = z.infer<typeof editStudentSchema>;

// Satisfies the compiler that the form shape matches what the API accepts.
const _typeCheck: EditStudentFormData extends UpdateStudentPayload
  ? true
  : never = true;
void _typeCheck;