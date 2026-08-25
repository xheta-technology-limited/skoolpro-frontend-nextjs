import * as z from "zod";
import {
  requiredString,
  phoneString,
  emailString,
  optionalPhoneString,
} from "@/lib/utils/zod-schemas";

export const schoolRecordSchema = z.object({
  schoolName: requiredString,
  displayName: requiredString,
  registrationNumber: requiredString,
  schoolTypes: z.array(z.string()).min(1, "Select at least one school type"),
  ownershipType: requiredString,
  dateOfEstablishment: requiredString,

  email: emailString,
  address: requiredString,
  phoneNumber: phoneString,

  emergencyPhoneNumber: optionalPhoneString,

  website: z.string(),
  socialMediaHandle: z.string(),
  motto: z.string(),
  description: z.string(),
});

export type SchoolRecordFormValues = z.infer<typeof schoolRecordSchema>;