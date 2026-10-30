import { Text } from "@/components/ui";
export const BlockElement = ({
  label,
  num,
}: {
  label: string;
  num: number;
}) => {
  return (
    <div className="p-4 border border-primary-100 flex flex-col gap-2 rounded-ml min-w-28 max-w-full lg:w-60">
      <Text scale={"caption"} className="text-neutrals-800">
        {label}
      </Text>
      <Text scale={"feature"} weight={"accent"} className="text-neutrals-800">
        {num}
      </Text>
    </div>
  );
};
