import * as z from "zod";
export const educationStructureSchema = z.object({
  stages: z
    .array(z.string(), { error: "Please pick at least one of these" })
    .nonempty("Please pick at least one of these"),
});
export type EducationStructureFormData = z.infer<
  typeof educationStructureSchema
>;
