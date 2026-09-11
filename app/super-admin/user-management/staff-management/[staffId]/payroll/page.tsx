"use client";

import { useState } from "react";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";

export default function Payroll() {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  return (
    <>
      {isEditMode ? (
        <EditMode setEditMode={setEditMode} />
      ) : (
        <ViewMode setEditMode={setEditMode} />
      )}
    </>
  );
}
