import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

export const secondFormSchema = z.object({
  education_authority: requiredString,
  authority_country: requiredString,
  school_type: z.array(z.string()).nonempty("This field is required"),
  ownership_type: requiredString,
  establishment_date: requiredString,
  school_description: requiredString,
});
export type SecondFormData = z.infer<typeof secondFormSchema>;
