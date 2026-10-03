import { Text } from "@/components/ui";
import { PromotionCounts } from "@/features/promotion/types/api/promotion";

interface Props {
  data: PromotionCounts;
}

const getColor = {
  promoted: "#0B7B69",
  graduated: "#6155F5",
  repeated: "#0088FF",
  held: "#C18800",
};

const getHeading = {
  promoted: "Promoting",
  graduated: "Graduating",
  repeated: "Repeating",
  held: "Need placement",
};

export default function Counts({ data }: Props) {
  return (
    <>
      <div className="flex gap-2.5 items-center flex-wrap mb-8">
        {Object.entries(data).map(([key, value]) => (
          <div className="border border-primary-100 rounded-ml p-4 flex flex-col min-w-30 md:min-w-59 gap-2">
            <Text
              weight={"accent"}
              scale={"feature"}
              className={`text-[${getColor[key as keyof PromotionCounts]}]`}
            >
              {value}
            </Text>
            <Text className="text-neutrals-800" scale={"caption"}>
              {getHeading[key as keyof PromotionCounts]}
            </Text>
          </div>
        ))}
      </div>
    </>
  );
}
