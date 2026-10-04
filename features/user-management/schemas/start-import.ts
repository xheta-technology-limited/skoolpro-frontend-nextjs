import { z } from "zod";

export const startImportSchema = z.object({
  file: z.instanceof(File, { message: "A file is required" }),

  module: z.string().optional(),

  entity_type: z.string().optional(),
});

export type StartImportFormData = z.infer<typeof startImportSchema>;