"use client";

import { Text } from "@/components/ui";
import StructureItem from "../structure-item";
import { useProgressRouter } from "@/features/page-loader";
import { useGetEducationSummary } from "@/features/academic-year/api/get-education-summary";

type Block = {
  label: string;
  data: number;
};
const BLOCKS: Block[] = [
  { label: "Stages", data: 10 },
  { label: "Levels", data: 10 },
  { label: "Classes", data: 10 },
  { label: "Active levels", data: 10 },
];

export default function EducationStructure() {
  const router = useProgressRouter();

  const { data, isPending } = useGetEducationSummary({
    refetchOnWindowFocus: false,
  });

  return (
    <StructureItem
      isLoading={isPending}
      label="EDUCATION STRUCTURE"
      primaryButtonText="Add Stage"
      primaryButtonFunc={() => {
        router.push(
          "/super-admin/structure-and-curriculum/structure?tab=education&add-stage=true"
        );
      }}
      secondaryButtonText="Add level"
      secondaryButtonFunc={() =>
        router.push(
          "/super-admin/structure-and-curriculum/structure?tab=education&add-level=true"
        )
      }
    >
      <div className="flex gap-2.5 flex-wrap">
        <BlockElement label={"Stages"} num={data?.stage_count || 0} />
        <BlockElement label={"Levels"} num={data?.level_count || 0} />
        <BlockElement label={"Classes"} num={data?.class_section_count || 0} />
        <BlockElement
          label={"Active levels"}
          num={data?.active_level_count || 0}
        />
      </div>
    </StructureItem>
  );
}

const BlockElement = ({ label, num }: { label: string; num: number }) => {
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
