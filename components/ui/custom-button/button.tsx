import { cva } from "class-variance-authority";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Spinner } from "@/components/animations";
import { getSpinnerColor, getSpinnerSize } from "./helpers";
import clsx from "clsx";

const button = cva(
  [
    "rounded-[28px]",
    "flex",
    "gap-2",
    "items-center",
    "justify-center",
    "cursor-pointer",

    // transitions
    "transition-all",
    "duration-fast",
    "ease-in-out",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-primary", "text-base-white", "border-transparent"],
        secondary: [
          "bg-transparent",
          "text-primary",
          "border",
          "border-primary",
        ],
        tertiary: ["bg-transparent", "text-primary", "border-transparent"],
      },
      size: {
        lg: ["text-sm", "md:text-base", "py-4", "px-4", "md:px-8"],
        md: ["text-sm", "md:text-base", "py-3.5", "px-4", "md:px-8"],
        sm: ["text-xs", "md:text-sm", "py-2", "px-4"],
      },
      disabled: {
        false: null,
        true: ["cursor-not-allowed text-neutral-200"],
      },
      loading: {
        false: null,
        true: "cursor-default",
      },
      iconOnly: {
        false: null,
        true: "rounded-round",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        disabled: false,
        class: "hover:bg-blue-600 focus:bg-primary-500 active:bg-primary-1000",
      },
      {
        variant: "primary",
        disabled: true,
        class: "bg-primary-100",
      },
      {
        variant: "primary",
        loading: true,
        class: "bg-primary-1000",
      },
      {
        variant: "secondary",
        disabled: false,
        class:
          "hover:bg-primary-100 focus:border-primary-500 active:bg-primary-100",
      },
      {
        variant: "secondary",
        disabled: true,
        class: "border-primary-200",
      },
      {
        variant: "tertiary",
        disabled: false,
        class:
          "hover:bg-primary-100 focus:border-primary-500 focus:bg-primary-100 active:bg-primary-200",
      },
      {
        variant: "tertiary",
        disabled: true,
        class: "border-0",
      },
      {
        variant: "tertiary",
        loading: true,
        class: "bg-neutral-200",
      },
      {
        size: "lg",
        iconOnly: true,
        class: "p-4!",
      },
      {
        size: "md",
        iconOnly: true,
        class: "p-3.5!",
      },
      {
        size: "sm",
        iconOnly: true,
        class: "p-2!",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
    },
  }
);

type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  iconOnly,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        button({ variant, size, disabled, loading, iconOnly }),
        props.className
      )}
      disabled={disabled || loading || undefined}
    >
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
      {loading && (
        <Spinner size={getSpinnerSize(size)} color={getSpinnerColor(variant)} />
      )}
    </button>
  );
};

export default Button;
