import { z } from "zod";
import { addStaffFirstSchema, addStaffSecondSchema } from "./add-staff-schema";

export const editStaffSchema = {
  ...addStaffFirstSchema.partial(),
  ...addStaffSecondSchema.partial(),
};

export type EditStaffFormData = z.infer<typeof editStaffSchema>;
