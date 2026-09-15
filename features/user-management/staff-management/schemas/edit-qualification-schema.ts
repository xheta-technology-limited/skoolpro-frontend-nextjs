import { z } from "zod";
import { qualificationSchema } from "./add-qualification-schema";

export const editQualificationSchema = z.object({
  ...qualificationSchema.partial().shape,
});

export type EditQualificationFormData = z.infer<
  typeof editQualificationSchema
>;