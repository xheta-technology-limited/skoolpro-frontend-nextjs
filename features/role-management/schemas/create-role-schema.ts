import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createRoleSchema = z
  .object({
    name: requiredString,
    permissions: z.union([z.array(z.string()), z.boolean()]),
  })
  .superRefine((data, ctx) => {
    if (
      data.permissions === false ||
      (Array.isArray(data.permissions) && data.permissions.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["permissions"],
        message: "This field is required",
      });
    }
  });

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
