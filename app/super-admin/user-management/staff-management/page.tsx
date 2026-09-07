"use client";

import Header from "../_components/header";

export default function StaffManagement() {
  const exportStaff = () => alert("export clicked");
  const addStaff = () => alert("add clicked");
  const importStaff = () => alert("import clicked");
  return (
    <>
      <Header
        role="staff"
        onExportClick={exportStaff}
        onAddClick={addStaff}
        onImportClick={importStaff}
      />
    </>
  );
}
