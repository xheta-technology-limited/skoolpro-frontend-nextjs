"use client";

import StructureItem from "../structure-item";
import { useProgressRouter } from "@/features/page-loader";
import { useGetEducationSummary } from "@/features/academic-year/api/get-education-summary";
import { BlockElement } from "../../../_components/block-element";

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
