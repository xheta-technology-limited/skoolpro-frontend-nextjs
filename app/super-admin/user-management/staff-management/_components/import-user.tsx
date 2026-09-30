"use client";
import { Suspense } from "react";
import FirstModal from "../../_components/modals/import-user-first";
import SecondModal from "../../_components/modals/import-user-second";
import ThirdModal from "../../_components/modals/import-user-third";
import FourthModal from "../../_components/modals/import-user-fourth";
import { useProgressRouter } from "@/features/page-loader";
import { useImportStaffStore } from "@/features/user-management/stores/import-staff.store";
import { staffKeys } from "@/features/user-management/staff-management/api/query-keys";

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

  const data = useImportStaffStore((s) => s.data);
  const updateStoreData = useImportStaffStore((s) => s.updateData);
  const keys = staffKeys.all;

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
        module="staff"
        updateStoreData={updateStoreData}
      />
      <ThirdModal
        title={title}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        tableColumns={tableColumns}
        tableKeys={mapKeys}
        invalidateQueryKeys={keys}
        module="staff"
        storeData={data}
        updateStoreData={updateStoreData}
      />
      <FourthModal
        title={title}
        importAnotherFn={handleImportAnother}
        handleClose={handleClose}
        module="staff"
        invalidateQueryKeys={keys}
        storeData={data}
      />
    </Suspense>
  );
}
