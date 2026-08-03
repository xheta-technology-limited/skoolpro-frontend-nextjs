import { cva } from "class-variance-authority";

export const linkVariants = cva(
  "text-primary transition-colors hover:underline hover:underline-offset-4 focus:border-2 focus:rounded-[2px] focus:border-primary active:underline active:underline-offset-4 active:text-primary-500 disabled:text-neutrals-200 aria-disabled:text-neutrals-200 aria-disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        lg: ["text-[18px]"],
        md: ["text-base"],
        sm: ["text-sm"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
