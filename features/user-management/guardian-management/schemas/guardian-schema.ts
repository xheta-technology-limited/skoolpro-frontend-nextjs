import { z } from "zod";

export const addGuardianSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  photoId: z.instanceof(File).optional(),
  phone: z.string().optional(),
  altPhone: z.string().optional(),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  preferredContactMethod: z.string().optional(),
  homeAddress: z.string().optional(),
  workAddress: z.string().optional(),
});

export type AddGuardianValues = z.infer<typeof addGuardianSchema>;

export const DEFAULT_ADD_GUARDIAN_VALUES: AddGuardianValues = {
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  nationality: "",
  occupation: "",
  employer: "",
  photoId: undefined,
  phone: "",
  altPhone: "",
  email: "",
  preferredContactMethod: "",
  homeAddress: "",
  workAddress: "",
};


export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const PREFERRED_CONTACT_METHOD_OPTIONS = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
];
