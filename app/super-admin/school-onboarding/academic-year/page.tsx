import { Text } from "@/components/ui";
import { dummyData } from "./constants";

export default function AcademicYearPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <span className="bg-secondary-700 h-4 w-4 rounded-full inline-block mr-2" />
        <Text weight={"accent"} scale={"highlight"}>
          {dummyData.name.toUpperCase()}
        </Text>
      </div>
    </div>
  );
}
