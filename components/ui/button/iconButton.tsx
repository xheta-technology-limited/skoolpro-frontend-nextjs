import { Spinner } from "@/components/animations";
import Button from "./button";

type IconButtonProps = {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = ({ icon, ...props }: IconButtonProps) => {
  return (
    <Button iconOnly {...props}>
      {!props.loading && icon}
    </Button>
  );
};

export default IconButton;
