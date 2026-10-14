import { z } from "zod";

export const createBandSchema = z.object({
  label: z.string(),
  min_score: z.string().refine((value) => {
    const number = Number(value);
    return (
      value.trim() !== "" &&
      Number.isFinite(number) &&
      number >= 1 &&
      number < 100
    );
  }, "Please enter a valid number between 0 and 100"),
  max_score: z.string().refine((value) => {
    const number = Number(value);
    return (
      value.trim() !== "" &&
      Number.isFinite(number) &&
      number >= 1 &&
      number < 100
    );
  }, "Please enter a valid number between 0 and 100"),
  grade_point: z
    .string()
    .refine((value) => {
      const number = Number(value);
      return value.trim() !== "" && Number.isFinite(number) && number >= 1;
    }, "Please enter a valid number")
    .optional(),
  description: z.string().optional(),
  comment: z.string().optional(),
  is_pass: z.boolean().optional(),
});

export type CreateBandFormData = z.infer<typeof createBandSchema>;

export const scopeSchema = z
  .object({
    // Required enum
    scope: z.enum(["general", "programme", "class"]),

    // Required number, constrained to 0-100
    mark: z.number().min(0).max(100),

    // Conditionally required UUIDs
    education_stage_id: z.uuid().optional(),
    class_section_id: z.uuid().optional(),
  })
  .superRefine((data, ctx) => {
    // Required when scope = "programme"
    if (data.scope === "programme" && !data.education_stage_id) {
      ctx.addIssue({
        code: "custom",
        path: ["education_stage_id"],
        message: "education_stage_id is required when scope is 'programme'",
      });
    }

    // Required when scope = "class"
    if (data.scope === "class" && !data.class_section_id) {
      ctx.addIssue({
        code: "custom",
        path: ["class_section_id"],
        message: "class_section_id is required when scope is 'class'",
      });
    }
  });

export type Scope = z.infer<typeof scopeSchema>;
