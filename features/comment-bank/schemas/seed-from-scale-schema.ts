import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const seedFromScaleSchema = z.object({
  grade_scale_id: requiredString,
  type: z.enum([
    "subject_teacher",
    "form_teacher",
    "head_teacher",
    "principal",
  ]),
  education_level_id: z.string().optional(),
});

export type SeedFromScaleFormData = z.infer<typeof seedFromScaleSchema>;
