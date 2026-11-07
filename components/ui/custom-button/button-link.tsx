import Link from "next/link";
import clsx from "clsx";
import { button } from "@/components/ui/custom-button/button";

type ButtonLinkProps = {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  iconOnly?: boolean;
} & React.ComponentPropsWithoutRef<typeof Link>;

const ButtonLink: React.FC<ButtonLinkProps> = ({
  variant,
  size,
  leftIcon,
  rightIcon,
  disabled,
  iconOnly,
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <Link
      {...props}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={clsx(button({ variant, size, disabled, iconOnly }), className)}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
};

export default ButtonLink;
