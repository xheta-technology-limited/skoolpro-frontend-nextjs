"use client";
import { Suspense } from "react";
import FirstModal from "../_components/import-user-first";
import SecondModal from "../_components/import-user-second";
import ThirdModal from "../_components/import-user-third";
import FourthModal from "../_components/import-user-fourth";
import { useProgressRouter } from "@/features/page-loader";

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

  const tableColumns = ["Name", "Student no.", "Admission no.", "Status", "Details"];
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
      />
      <ThirdModal
        title={title}
        nextStepUrl={nextStepUrl}
        handleClose={handleClose}
        tableColumns={tableColumns}
        tableKeys={mapKeys}
        module="students"
      />
      <FourthModal
        title={title}
        importAnotherFn={handleImportAnother}
        handleClose={handleClose}
      />
    </Suspense>
  );
}
