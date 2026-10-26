"use client";

import { Text } from "@/components/ui";
import { useParams, useSearchParams } from "next/navigation";
import EducationStructure from "./_components/education-structure/structure";

export default function Structure() {
  const params = useSearchParams();
  const activeTab = params.get("tab");
  return (
    <>
      {activeTab === "education" ? (
        <Education />
      ) : activeTab === "classes" ? (
        <Classes />
      ) : null}
    </>
  );
}

const Education = () => {
  return (
    <div className="flex gap-8 flex-col">
      <EducationStructure />
    </div>
  );
};

const Classes = () => {
  return null;
};
