import { z } from "zod";

export const classSectionsSchema = z.object({
  arm_name: z.string(),
  arm_code: z.string(),
  campus: z.string(),
  class_teacher: z.string(),
  class_capacity: z.number().min(1, "Please enter a valid capacity"),
  class_status: z.enum(["active", "inactive", "pending"]),
});
export type ClassSectionsFormData = z.infer<typeof classSectionsSchema>;
