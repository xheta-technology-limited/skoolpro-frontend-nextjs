import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createRoleSchema = z
  .object({
    name: requiredString,
    permissions: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.permissions.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["permissions"],
        message: "This field is required",
      });
    }
  });

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
