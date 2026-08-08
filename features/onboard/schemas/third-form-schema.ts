import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

const hex = z
  .string()
  //.nonempty("This field is required")
  .regex(/^#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, {
    error: "Please enter a valid hex color",
  });
export const thirdFormSchema = z.object({
  school_address: requiredString,
  second_school_address: z.string(),
  telephone_number: requiredString,
  email_address: requiredString,
  school_website: requiredString,
  social_media_account: requiredString,
  primary_hex_code: hex,
  secondary_hex_code: hex,
  tertiary_hex_code: hex,
});
export type ThirdFormData = z.infer<typeof thirdFormSchema>;
