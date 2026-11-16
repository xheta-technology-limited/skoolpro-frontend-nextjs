import { cva } from "class-variance-authority";
import clsx from "clsx";

type Props = {
  variant?: "base" | "error" | "success";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const button = cva([], {
  variants: {
    variant: {
      base: "border-grays-borders text-neutrals-700",
      error: "border-error text-error",
      success: "border-success text-success-200",
    },
  },
});
export default function MiniButton({
  children,
  variant = "base",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        button({ variant }),
        "rounded-[12px] border py-1.5 px-2 text-[0.75rem]",
        props.className
      )}
    >
      {children}
    </button>
  );
}
