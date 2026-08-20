import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

export const billingDetailsSchema = z.object({
  status: requiredString,
  startDate: requiredString,
  endDate: requiredString,
  billingFrequency: requiredString,
  paymentStatus: requiredString,
  billingContactName: requiredString,
  billingContactOrganization: requiredString,
  billingContactEmail: z.email("This field is required"),
  billingAddress: requiredString,
  purchaseOrderReference: requiredString,
  taxIdentifier: requiredString,
});

export type BillingDetailsFormValues = z.infer<typeof billingDetailsSchema>;