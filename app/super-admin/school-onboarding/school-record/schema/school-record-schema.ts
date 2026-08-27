import * as z from "zod";

export const schoolRecordSchema = z.object({
  schoolName: z.string(),
  displayName: z.string().min(1, "Display name is required"),
  registrationNumber: z.string(),
  schoolTypes: z
    .array(z.string())
    .min(1, "Select at least one school type"),
  ownershipType: z.string(),
  dateOfEstablishment: z.string(),

  email: z.string(),
  address: z.string(),
  phoneNumber: z.string(),

  emergencyPhoneNumber: z.string(),

  website: z.string(),
  socialMediaHandle: z.string(),
  motto: z.string(),
  description: z.string(),
});

export type SchoolRecordFormValues = z.infer<
  typeof schoolRecordSchema
>;