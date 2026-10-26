import { numericString, requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createLevelSchema = z.object({
  education_stage_id: requiredString,
  name: requiredString,
  code: z.string().optional(),
  typical_entry_age: numericString({}).optional(),
  insert_after_level_id: z.string().optional(),
  position: z.enum(["after_level", "end_of_stage"]).optional(),
});

export type CreateLevelFormData = z.infer<typeof createLevelSchema>;
