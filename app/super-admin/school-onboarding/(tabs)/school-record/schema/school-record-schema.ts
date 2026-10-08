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

export const schoolIdentitySchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  displayName: z.string().min(1, "Short name is required"),
  schoolTypes: z.array(z.string()).min(1, "Select at least one school type"),
  ownershipType: z.string().min(1, "Ownership type is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  countryCode: z.string().min(1, "Country is required"),
  dateOfEstablishment: z.string().min(1, "Date of establishment is required"),
  motto: z.string().max(200, "Motto must be 200 characters or fewer"),
});

export type SchoolIdentityFormValues = z.infer<typeof schoolIdentitySchema>;