import * as z from "zod";
import {
  requiredString,
  phoneString,
  emailString,
  hexColorString,
} from "@/lib/utils/zod-schemas";

const schoolInputSchema = z.object({
  registered_name: requiredString,
  display_name: z.string().optional(),
  ownership_type: z.string().optional(),
  founding_date: z.string().optional(),
  description: z.string().optional(),
  education_authorities: z.string().optional(),
  motto: z.string().optional(),
  primary_color: hexColorString.optional(),
  secondary_color: hexColorString.optional(),
});

const schoolOutputSchema = z.object({
  registered_name: requiredString,
  display_name: z.string().optional(),
  ownership_type: z.string().optional(),
  founding_date: z.string().optional(),
  description: z.string().optional(),
  education_authorities: z.array(z.string()).optional(),
  motto: z.string().optional(),
  primary_color: hexColorString.optional(),
  secondary_color: hexColorString.optional(),
});

const campusSchema = z.object({
  name: z.string().optional(),
  is_primary: z.boolean().optional(),
  address_line_1: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  country_code: z.string().optional(),
  timezone: z.string().optional(),
  student_capacity: z.string().optional(),
});

const registrationNumberSchema = z.object({
  country_code: z.string().optional(),
  number: z.string().optional(),
  issuing_authority: z.string().optional(),
});

const contactSchema = z.object({
  type: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
  is_primary: z.boolean().optional(),
});

const keyContactSchema = z.object({
  role_type: z.string().optional(),
  full_name: z.string().optional(),
  job_title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

const onboardingSchema = z.object({
  priority: z.string().optional(),
  target_go_live_date: z.string().optional(),
});

export const schoolProfileInputSchema = z.object({
  school: schoolInputSchema,
  type_slugs: z.array(z.string()).min(1, "This field is required"),
  campuses: z.array(campusSchema).optional(),
  registration_numbers: z.array(registrationNumberSchema).optional(),
  contacts: z.array(contactSchema).optional(),
  key_contacts: z.array(keyContactSchema).optional(),
  onboarding: onboardingSchema.optional(),
});

export const schoolProfileSchema = z.object({
  school: schoolOutputSchema,
  type_slugs: z.array(z.string()).min(1, "This field is required"),
  campuses: z.array(campusSchema).optional(),
  registration_numbers: z.array(registrationNumberSchema).optional(),
  contacts: z.array(contactSchema).optional(),
  key_contacts: z.array(keyContactSchema).optional(),
  onboarding: onboardingSchema.optional(),
});

export type SchoolProfileFormValues = z.infer<typeof schoolProfileSchema>;
export type SchoolProfileFormInput = z.infer<typeof schoolProfileInputSchema>;
