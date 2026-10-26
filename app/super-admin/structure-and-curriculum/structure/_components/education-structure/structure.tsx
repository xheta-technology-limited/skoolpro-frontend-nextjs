"use client";

import { Text } from "@/components/ui";
import StructureItem from "../structure-item";
import { useProgressRouter } from "@/features/page-loader";

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
  const searchParams = new URLSearchParams(window.location.search);

  const onAddLevel = () => {
    searchParams.set("add-level", "true");
    router.push(`?${searchParams.toString()}`);
  };
  return (
    <StructureItem
      isLoading
      label="EDUCATION STRUCTURE"
      primaryButtonText="Add Stage"
      primaryButtonFunc={() => null}
      secondaryButtonText="Add level"
      secondaryButtonFunc={onAddLevel}
    >
      <div className="flex gap-2.5 flex-wrap">
        {BLOCKS.map((b, index) => (
          <BlockElement key={index} block={b} />
        ))}
      </div>
    </StructureItem>
  );
}

const BlockElement = ({ block }: { block: Block }) => {
  return (
    <div className="p-4 border border-primary-100 flex flex-col gap-2 rounded-ml min-w-28 max-w-full lg:w-60">
      <Text scale={"caption"} className="text-neutrals-800">
        {block.label}
      </Text>
      <Text scale={"feature"} weight={"accent"} className="text-neutrals-800">
        {block.data}
      </Text>
    </div>
  );
};
