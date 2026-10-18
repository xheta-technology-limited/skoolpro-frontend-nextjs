import { z } from "zod";
import { createBandSchema } from "./create-band-schema";

export const createGradeScaleSchema = z.object({
  name: z.string(),
  is_default: z.boolean().optional(),
  is_active: z.boolean().optional(),
  bands: z.array(createBandSchema).optional(),
});

export type CreateGradeScaleFormData = z.infer<typeof createGradeScaleSchema>;
