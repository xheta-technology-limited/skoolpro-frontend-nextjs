import { Text } from "@/components/ui";
import Body from "./_components/body";

export default function Catalog() {
  return (
    <div className="p-6 bg-white rounded-tr-ml mb-1">
      <Text
        scale={"highlightMobile"}
        weight={"accent"}
        className="text-neutrals-800"
      >
        Permission catalog
      </Text>
      <Text scale={"contentMobile"} className="text-neutrals-700">
        The full permission taxonomy, grouped by module and resource
      </Text>

      <div className="h-8" />

      <Body />
    </div>
  );
}
