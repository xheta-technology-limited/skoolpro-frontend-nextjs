import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const updateSubjectAssignmentSchema = z.object({
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

export type UpdateSubjectAssignmentFormData = z.infer<
  typeof updateSubjectAssignmentSchema
>;
