"use client";

import { Text } from "@/components/ui";
import { useParams, useSearchParams } from "next/navigation";
import { Stages, EducationStructure } from "./_components/education-structure";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Structure() {
  const params = useSearchParams();
  const activeTab = params.get("tab");
  const router = useRouter();

  useEffect(() => {
    router.push("?tab=education");
  }, []);
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
      <Stages />
    </div>
  );
};

const Classes = () => {
  return null;
};
