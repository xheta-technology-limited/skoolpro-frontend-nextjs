import * as z from "zod";
import { requiredString, emailString } from "@/lib/utils/zod-schemas";

export const billingDetailsSchema = z.object({
  status: requiredString,
  startDate: requiredString,
  endDate: requiredString,
  billingFrequency: requiredString,
  paymentStatus: requiredString,
  billingContactName: requiredString,
  billingContactOrganization: requiredString,
  billingContactEmail: emailString,
  billingAddress: requiredString,
  purchaseOrderReference: requiredString,
  taxIdentifier: requiredString,
});

export type BillingDetailsFormValues = z.infer<typeof billingDetailsSchema>;