import * as z from "zod";

export const requiredString = z.string().nonempty("This field is required");
