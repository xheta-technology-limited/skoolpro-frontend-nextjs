import { z } from "zod";

export const commitPromotionSchema = z.object({
  decisions: z.record(
    z.string(),
    z.object({
      disposition: z.enum(["promote", "graduate", "repeat", "hold"]).optional(),
      target_section_id: z.string().optional(),
    })
  ),
});

export type CommitPromotionFormData = z.infer<typeof commitPromotionSchema>;