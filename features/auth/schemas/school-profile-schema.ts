import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

const registrationSchema = z.object({
  registrationNumber: requiredString,
  regCountry: requiredString,
  issuingAuthority: requiredString,
  expiryDate: z.string().optional(),
});

const locationSchema = z.object({
  locationName: requiredString,
  locationCode: z.string().optional(),
  addressLine1: requiredString,
  city: requiredString,
  state: requiredString,
  postalCode: z.string().optional(),
  landmark: z.string().optional(),
  timezone: z.string().optional(),
  studentCapacity: z.string().optional(),
  isPrimary: z.boolean(),
});

const contactSchema = z.object({
  contactType: requiredString,
  contactLabel: requiredString,
  contactValue: requiredString,
  isPrimary: z.boolean(),
});

const keyContactSchema = z.object({
  keyContactRole: z.string().optional(),
  keyContactFullName: z.string().optional(),
  keyContactRoleTitle: z.string().optional(),
  keyContactEmail: z.email().optional().or(z.literal("")),
  keyContactPhone: z.string().optional(),
  isPrimary: z.boolean(),
});

const customColorSchema = z.object({
  colorName: z.string().optional(),
  colorValue: z.string().optional(),
  colorSwatch: z.string().optional(),
});

export const schoolProfileSchema = z.object({
  schoolName: requiredString,
  displayName: z.string().optional(),
  schoolType: z.array(z.string()).min(1, "Required"),
  ownershipType: requiredString,
  educationAuthority: z.string().optional(),
  country: requiredString,
  dateOfEstablishment: requiredString,
  description: z.string().optional(),
  registrationNumbers: z.array(registrationSchema).min(1),
  locations: z.array(locationSchema).min(1),
  contacts: z.array(contactSchema).min(1),
  keyContacts: z.array(keyContactSchema),
  primaryColor: z.string().optional(),
  primaryColorSwatch: z.string().optional(),
  secondaryColor: z.string().optional(),
  secondaryColorSwatch: z.string().optional(),
  tertiaryColor: z.string().optional(),
  tertiaryColorSwatch: z.string().optional(),
  accentColor: z.string().optional(),
  accentColorSwatch: z.string().optional(),
  customColors: z.array(customColorSchema),
  priorityLevel: z.string().optional(),
  targetGoLive: z.string().optional(),
});

export type SchoolProfileFormValues = z.infer<typeof schoolProfileSchema>;