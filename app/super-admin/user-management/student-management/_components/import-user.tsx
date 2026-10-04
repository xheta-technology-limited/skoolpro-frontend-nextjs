"use client";
import { Suspense } from "react";
import FirstModal from "../../_components/modals/import-user-first";
import SecondModal from "../../_components/modals/import-user-second";
import ThirdModal from "../../_components/modals/import-user-third";
import FourthModal from "../../_components/modals/import-user-fourth";
import { useProgressRouter } from "@/features/page-loader";
import { useImportStudentsStore } from "@/features/user-management/stores/import-student.store";
import { studentKeys } from "@/features/user-management/student-management/api/query-keys";

export default function ImportStudent() {
  const router = useProgressRouter();
  const title = "Import Student";
  const nextStepUrl = "/super-admin/user-management/student-management";
  const handleClose = () =>
    router.replace("/super-admin/user-management/student-management");
  const handleImportAnother = () =>
    router.push(
      "/super-admin/user-management/student-management?import-modal=true&current=1"
    );

  const data = useImportStudentsStore((s) => s.data);
  const updateStoreData = useImportStudentsStore((s) => s.updateData);
  const keys = studentKeys.all;

  const tableColumns = [
    "Name",
    "Student no.",
    "Admission no.",
    "Status",
    "Details",
  ];
  const mapKeys = ["student_id_number", "admission_number"];
  return (
    <Suspense fallback={null}>
      <FirstModal
        title="Import Student"
        templateTexts={[
          "Student import template",
          "CSV · 28 columns · required: student ID number, first name, last name, date of birth",
        ]}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        module="students"
      />
      <SecondModal
        title={title}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        module="students"
        updateStoreData={updateStoreData}
      />
      <ThirdModal
        title={title}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        tableColumns={tableColumns}
        tableKeys={mapKeys}
        module="students"
        invalidateQueryKeys={keys}
        storeData={data}
        updateStoreData={updateStoreData}
      />
      <FourthModal
        title={title}
        importAnotherFn={handleImportAnother}
        handleClose={handleClose}
        invalidateQueryKeys={keys}
        storeData={data}
        module="students"
      />
    </Suspense>
  );
}
