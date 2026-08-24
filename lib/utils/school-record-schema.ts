import * as z from "zod";
import {
  requiredString,
  phoneString,
  emailString,
} from "@/lib/utils/zod-schemas";

export const schoolRecordSchema = z.object({
  schoolName: requiredString,
  displayName: requiredString,
  registrationNumber: requiredString,
  schoolType: requiredString,
  ownershipType: requiredString,
  dateOfEstablishment: requiredString,
  email: emailString,
  address: requiredString,
  phoneNumber: phoneString,
  emergencyPhoneNumber: phoneString,
  website: requiredString,
  socialMediaHandle: requiredString,
  motto: requiredString,
  description: requiredString,
});

export type SchoolRecordFormValues = z.infer<typeof schoolRecordSchema>;