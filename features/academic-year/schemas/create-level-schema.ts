import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createLevelSchema = z.object({
  education_stage_id: requiredString,
  name: requiredString,
  code: z.string().optional(),
  typical_entry_age: z
    .number()
    .int()
    .min(0, "Entry age must be between 0 and 100")
    .max(100, "Entry age must be between 0 and 100")
    .optional(),
  insert_after_level_id: z.string().optional(),
});

export type CreateLevelFormData = z.infer<typeof createLevelSchema>;
