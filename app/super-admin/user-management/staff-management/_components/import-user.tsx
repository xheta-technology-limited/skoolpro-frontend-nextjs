"use client";
import { Suspense } from "react";
import FirstModal from "./modals/import-user-first";
import SecondModal from "./modals/import-user-second";
import ThirdModal from "./modals/import-user-third";
import FourthModal from "./modals/import-user-fourth";
import { useProgressRouter } from "@/features/page-loader";

export default function ImportStaff() {
  const router = useProgressRouter();
  const title = "Import Staff";
  const nextStepUrl = "/super-admin/user-management/staff-management";
  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");
  const handleImportAnother = () =>
    router.push(
      "/super-admin/user-management/staff-management?import-modal=true&current=1"
    );

  const tableColumns = ["Name", "Staff no.", "Category", "Status", "Details"];
  const mapKeys = ["staff_number", "category"];
  return (
    <Suspense fallback={null}>
      <FirstModal
        title="Import Staff"
        templateTexts={[
          "Staff import template",
          "CSV · 15 columns · required: staff number, first name, last name, category",
        ]}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        module="staff"
      />
      <SecondModal
        title={title}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
      />
      <ThirdModal
        title={title}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        tableColumns={tableColumns}
        tableKeys={mapKeys}
      />
      <FourthModal
        title={title}
        importAnotherFn={handleImportAnother}
        handleClose={handleClose}
      />
    </Suspense>
  );
}
