import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const assignSubjectSchema = z.object({
  subject_id: requiredString,
  education_level_id: z.string(),
  class_section_id: z.string().optional(),
  is_compulsory: z.union([z.string(), z.boolean()]).optional(), //switched to boolean in submit handler
  pass_mark: z
    .string()
    .refine((value) => {
      const number = Number(value);
      return (
        value.trim() !== "" &&
        Number.isFinite(number) &&
        number >= 1 &&
        number < 100
      );
    }, "Please enter a valid number between 1 and 100")
    .optional(),
  is_active: z.union([z.string(), z.boolean()]).optional(), //switched to boolean in submit handler
});

export type AssignSubjectFormData = z.infer<typeof assignSubjectSchema>;
