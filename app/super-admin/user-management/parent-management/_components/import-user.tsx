"use client";
import { Suspense } from "react";
import FirstModal from "../../_components/modals/import-user-first";
import SecondModal from "../../_components/modals/import-user-second";
import ThirdModal from "../../_components/modals/import-user-third";
import FourthModal from "../../_components/modals/import-user-fourth";
import { useProgressRouter } from "@/features/page-loader";
import { useImportGuardianStore } from "@/features/user-management/stores/import-guardian-store";
import { guardianKeys } from "@/features/user-management/guardian-management/api/query-keys";

const TITLE = "Import Guardian";
const PARENT_MANAGEMENT_URL = "/super-admin/user-management/parent-management";
const IMPORT_ANOTHER_URL = `${PARENT_MANAGEMENT_URL}?import-modal=true&current=1`;

// Matches guardian_import_sample.csv: 15 columns, snake_case headers
// identical to the POST /guardians field names.
//
// Required: first_name, last_name, and at least one of email / phone.
const TEMPLATE_TEXTS = [
  "Guardian import template",
  "CSV · 15 columns · required: first_name, last_name, and at least one of email or phone",
];

const TABLE_COLUMNS = [
  "Name",
  "Email address",
  "Phone no.",
  "Status",
  "Details",
];
const TABLE_KEYS = ["email", "phone"];

export default function ImportGuardian() {
  const router = useProgressRouter();

  const data = useImportGuardianStore((s) => s.data);
  const updateStoreData = useImportGuardianStore((s) => s.updateData);

  const handleClose = () => router.replace(PARENT_MANAGEMENT_URL);
  const handleImportAnother = () => router.push(IMPORT_ANOTHER_URL);

  return (
    <Suspense fallback={null}>
      <FirstModal
        title={TITLE}
        templateTexts={TEMPLATE_TEXTS}
        nextStepUrl={PARENT_MANAGEMENT_URL}
        handleClose={handleClose}
        module="guardian"
      />
      <SecondModal
        title={TITLE}
        nextStepUrl={PARENT_MANAGEMENT_URL}
        handleClose={handleClose}
        module="guardian"
        updateStoreData={updateStoreData}
      />
      <ThirdModal
        title={TITLE}
        nextStepUrl={PARENT_MANAGEMENT_URL}
        handleClose={handleClose}
        tableColumns={TABLE_COLUMNS}
        tableKeys={TABLE_KEYS}
        module="guardian"
        invalidateQueryKeys={guardianKeys.all}
        storeData={data}
        updateStoreData={updateStoreData}
      />
      <FourthModal
        title={TITLE}
        importAnotherFn={handleImportAnother}
        handleClose={handleClose}
        invalidateQueryKeys={guardianKeys.all}
        storeData={data}
        module="guardian"
      />
    </Suspense>
  );
}