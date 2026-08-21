import * as z from "zod";
import { requiredString, emailString } from "@/lib/utils/zod-schemas";

export const billingDetailsSchema = z.object({
  status: requiredString,
  starts_on: requiredString,
  ends_on: requiredString,
  billing_frequency: requiredString,
  payment_status: requiredString,
  billing_contact_name: requiredString,
  billing_contact_organization: z.string().optional(),
  billing_contact_email: emailString,
  billing_address: z.string().optional(),
  purchase_order_reference: z.string().optional(),
  tax_identifier: z.string().optional(),
});

export type BillingDetailsFormValues = z.infer<typeof billingDetailsSchema>;
