import { z } from "zod";
import { addStaffFirstSchema, addStaffSecondSchema } from "./add-staff-schema";
export const editStaffSchema = z.object({
  ...addStaffFirstSchema.partial().shape,
  ...addStaffSecondSchema.partial().shape,
});
export type EditStaffFormData = z.infer<typeof editStaffSchema>;
