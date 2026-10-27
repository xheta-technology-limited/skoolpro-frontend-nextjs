"use client";

import { Text } from "@/components/ui";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Subjects from "./_components/subjects/subjects";
import SubjectAssignments from "./_components/subject-assignments/subject-assignments";
import ClassSubjects from "./_components/class-subjects/class-subjects";

export default function Curriculum() {
  const params = useSearchParams();
  const activeTab = params.get("tab");
  const router = useRouter();

  return (
    <>
      {activeTab === "subjects" ? (
        <Subjects />
      ) : activeTab === "subject-assignments" ? (
        <SubjectAssignments />
      ) : activeTab === "class-subjects" ? (
        <ClassSubjects />
      ) : null}
    </>
  );
}
