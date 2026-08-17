import * as z from "zod";
import { requiredString, phoneString } from "@/lib/utils/zod-schemas";

const registrationSchema = z.object({
  registrationNumber: requiredString,
  regCountry: requiredString,
  issuingAuthority: requiredString,
  expiryDate: requiredString,
});

const locationSchema = z.object({
  locationName: requiredString,
  locationCode: requiredString,
  addressLine1: requiredString,
  city: requiredString,
  state: requiredString,
  postalCode: requiredString,
  landmark: requiredString,
  timezone: requiredString,
  studentCapacity: requiredString,
  isPrimary: z.boolean(),
});

const contactSchema = z
  .object({
    contactType: requiredString,
    contactLabel: requiredString,
    contactValue: requiredString,
    isPrimary: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.contactType === "phone_number") {
        return /^\+?[0-9]{7,15}$/.test(data.contactValue);
      }
      if (data.contactType === "email") {
        return z.email().safeParse(data.contactValue).success;
      }
      return true;
    },
    {
      message: "Enter a valid value for the selected contact type",
      path: ["contactValue"],
    }
  );

const keyContactSchema = z.object({
  keyContactRole: requiredString,
  keyContactFullName: requiredString,
  keyContactRoleTitle: requiredString,
  keyContactEmail: z.email("This field is required"),
  keyContactPhone: phoneString,
  isPrimary: z.boolean(),
});

const customColorSchema = z.object({
  colorName: requiredString,
  colorValue: requiredString,
  colorSwatch: requiredString,
});

export const schoolProfileSchema = z.object({
  schoolName: requiredString,
  displayName: requiredString,
  schoolType: z.array(z.string()).min(1, "This field is required"),
  ownershipType: requiredString,
  educationAuthority: requiredString,
  country: requiredString,
  dateOfEstablishment: requiredString,
  description: requiredString,
  registrationNumbers: z.array(registrationSchema).min(1),
  locations: z.array(locationSchema).min(1),
  contacts: z.array(contactSchema).min(1),
  keyContacts: z.array(keyContactSchema).min(1),
  primaryColor: requiredString,
  primaryColorSwatch: requiredString,
  secondaryColor: requiredString,
  secondaryColorSwatch: requiredString,
  tertiaryColor: requiredString,
  tertiaryColorSwatch: requiredString,
  accentColor: requiredString,
  accentColorSwatch: requiredString,
  customColors: z.array(customColorSchema),
  priorityLevel: requiredString,
  targetGoLive: requiredString,
});

export type SchoolProfileFormValues = z.infer<typeof schoolProfileSchema>;