import { z } from "zod";

export const classSectionsSchema = z.object({
  arm_name: z.string(),
  arm_code: z.string(),
  campus: z.string("This field is required"),
  class_teacher: z.string("This field is required"),
  class_capacity: z.string("This field is required").refine((value) => {
    const number = Number(value);
    return value.trim() !== "" && Number.isFinite(number) && number >= 1;
  }, "Please enter a valid number"),
  class_status: z.enum(["active", "inactive", "pending"], {
    error: "This field is required",
  }),
});
export type ClassSectionsFormData = z.infer<typeof classSectionsSchema>;
