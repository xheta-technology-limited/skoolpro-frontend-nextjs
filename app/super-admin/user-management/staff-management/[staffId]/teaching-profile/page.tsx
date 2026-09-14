"use client";

import { useState } from "react";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";
import SubjectsTaught from "./_components/subjects-taught";
import ClassesTaught from "./_components/classes-taught";

const dummySubjects = [
  { id: "1", name: "Chemistry" },
  { id: "2", name: "Physics" },
  { id: "3", name: "Biology" },
];

const dummyClasses = [
  { id: "1", name: "JS1" },
  { id: "2", name: "JS2" },
  { id: "3", name: "SS3" },
  { id: "4", name: "SS1" },
];

export default function TeachingProfile() {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  return (
    <>
      {isEditMode ? (
        <EditMode setEditMode={setEditMode} />
      ) : (
        <ViewMode setEditMode={setEditMode} />
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:gap-8 p-2">
        <SubjectsTaught subjects={dummySubjects} />
        <ClassesTaught classes={dummyClasses} />
      </div>
    </>
  );
}
