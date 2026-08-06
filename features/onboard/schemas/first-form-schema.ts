import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

export const firstFormSchema = z.object({
  school_name: requiredString,
  display_name: requiredString,
  registration_number: requiredString,
  country: requiredString,
  authority: requiredString,
  expiry_date: requiredString,
  file: z.file().nonoptional("This field is required"),
});
export type FirstFormData = z.infer<typeof firstFormSchema>;
