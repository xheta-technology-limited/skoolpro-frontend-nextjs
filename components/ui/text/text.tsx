import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

export const textVariants = cva(
  "tracking-normal leading-[1.2] text-neutrals-1000",
  {
    variants: {
      scale: {
        hero: ["text-[1.75rem]"],
        feature: ["text-[1.125rem]", "md:text-[1.5rem]"],
        highlight: ["text-[1rem]", "md:text-[1.125rem]"],
        content: ["text-[0.875rem]", "md:text-[1rem]"],
        caption: ["text-[0.75rem]", "md:text-[0.875rem]"],
        heading1: ["text-[1.75rem]", "md:text-[3.5rem]"],
        heading2: ["text-[1.5rem]", "md:text-[3rem]"],
        heading3: ["text-[1.25rem]", "md:text-[2.5rem]"],
        heading4: ["text-[1.125rem]", "md:text-[2rem]"],
        body1: ["text-[1rem]", "md:text-[1.25rem]"],
        display1: ["text-[2.75rem]", "md:text-[9rem]", "font-heading"],
        display2: ["text-[2.5rem]", "md:text-[6rem]", "font-heading"],
        display3: ["text-[2rem]", "md:text-[4rem]"],
        footnote: ["text-[0.625rem]"],
      },
      weight: {
        bold: "font-bold",
        accent: "font-semibold",
        emphasis: "italic",
        standard: "font-normal",
      },
    },

    defaultVariants: {
      scale: "content",
      weight: "standard",
    },
  }
);

type TextProps<T extends React.ElementType = "p"> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof textVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

const Text = <T extends React.ElementType = "p">({
  as,
  scale,
  weight,
  className,
  children,
  ...props
}: TextProps<T>) => {
  const Component = as ?? "p";
  const resolvedWeight =
    scale?.startsWith("heading") || scale?.startsWith("display")
      ? "bold"
      : weight;
  return (
    <Component
      className={clsx(
        textVariants({ scale, weight: resolvedWeight }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
