import { z } from "zod";

export const createPassMarkSchema = z
  .object({
    scope: z.enum(["general", "programme", "class"]),
    mark: z.number().min(0).max(100),
    education_stage_id: z.uuid().optional(),
    class_section_id: z.uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scope === "programme" && !data.education_stage_id) {
      ctx.addIssue({
        code: "custom",
        path: ["education_stage_id"],
        message: "education_stage_id is required when scope is 'programme'",
      });
    }

    if (data.scope === "class" && !data.class_section_id) {
      ctx.addIssue({
        code: "custom",
        path: ["class_section_id"],
        message: "class_section_id is required when scope is 'class'",
      });
    }
  });

export type CreatePassMarkFormData = z.infer<typeof createPassMarkSchema>;
