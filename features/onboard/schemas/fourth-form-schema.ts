import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

export const fourthFormSchema = z.object({
  motto: requiredString,
  logo: z.file(),
  license: z.file(),
  letterhead: z.file(),
});
export type FourthFormData = z.infer<typeof fourthFormSchema>;
