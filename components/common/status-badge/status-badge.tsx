import { Text } from "@/components/ui";
import clsx from "clsx";

interface StatusProps {
  data: string;
  variant: "red" | "green" | "orange";
}
const StatusBadge = ({ data, variant }: StatusProps) => {
  const variants =
    variant === "green"
      ? "text-success-200 bg-[#EDFDFA]"
      : variant === "orange"
      ? "bg-[#FDF6EC] text-warning-200"
      : variant === "red"
      ? "bg-[#FDF6EC] text-error-200"
      : "";
  return (
    <Text
      as="span"
      scale="footnote"
      weight="standard"
      className={clsx("rounded-[12px] px-2.5 py-0.5", variants)}
    >
      {data}
    </Text>
  );
};

export default StatusBadge;
