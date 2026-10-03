import { Text } from "@/components/ui";

interface Props {
  data: string;
}
export default function MiniBadge({ data }: Props) {
  return (
    <div className="max-w-fit bg-white border border-grays-borders rounded-[12px]">
      <Text scale={"captionMobile"}>{data}</Text>
    </div>
  );
}
