import { z } from "zod";

export const createPassMarkSchema = z
  .object({
    scope: z
      .enum(["general", "programme", "class"], "This field is required")
      .nonoptional("This field is required"),
    mark: z.string().refine((value) => {
      const number = Number(value);
      return (
        value.trim() !== "" &&
        Number.isFinite(number) &&
        number >= 1 &&
        number < 100
      );
    }, "Please enter a valid number between 0 and 100"),
    education_stage_id: z.string().optional(),
    class_section_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scope === "programme" && !data.education_stage_id) {
      ctx.addIssue({
        code: "custom",
        path: ["education_stage_id"],
        message: "Stage is required when scope is 'programme'",
      });
    }

    if (data.scope === "class" && !data.class_section_id) {
      ctx.addIssue({
        code: "custom",
        path: ["class_section_id"],
        message: "Class section is required when scope is 'class'",
      });
    }
  });

export type CreatePassMarkFormData = z.infer<typeof createPassMarkSchema>;
