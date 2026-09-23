"use client";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import ImportedTable from "./tables/imported-student";

export default function ThirdModal() {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "3";

  const validRows = "Nan";

  const handleClose = () =>
    router.replace("/super-admin/user-management/student-management");

  const handleProceed = () => {
    router.push(
      "/super-admin/user-management/student-management?import-modal=true&current=4"
    );
  };

  return (
    <FormModal
      title={"Import Students"}
      onOpenChange={handleClose}
      open={isOpen}
      step={{ current: 3, total: 4 }}
    >
      <>
        <div>
          <Text scale={"content"} className="text-neutrals-900">
            Validate
          </Text>
          <Text scale={"caption"} mobile className="text-neutrals-700 mb-4">
            Every row checked against the field rules and against existing
            students. Fix invalid rows in your file and re-upload, or carry on
            and commit the valid ones.
          </Text>

          <div className="flex gap-4 items-center">
            <StatusBadge variant="green" data="12 Valid" />
            <StatusBadge variant="orange" data="2 Duplicates" />
            <StatusBadge variant="red" data="1 Invalid" />
          </div>
        </div>

        <ImportedTable
          dataToMap={[
            {
              id: 1,
              name: "adewale johnson",
              admission_number: "ADM-001",
              gender: "Male",
              details: "",
            },
            {
              id: 2,
              name: "fatima abdullahi",
              admission_number: "ADM-002",
              gender: "Female",
              details: "",
            },
            {
              id: 3,
              name: "chinedu okoro",
              admission_number: "ADM-003",
              gender: "Male",
              details: "",
            },
            {
              id: 4,
              name: "grace amen",
              admission_number: "ADM-001",
              gender: "Female",
              details: "Ready to import",
            },
            {
              id: 5,
              name: "mohammed ali",
              admission_number: "ADM-004",
              gender: "Male",
              details: "",
            },
            {
              id: 6,
              name: "blessing ifeoma",
              admission_number: "ADM-005",
              gender: "Female",
              details: "",
            },
            {
              id: 7,
              name: "emeka nwosu",
              admission_number: "ADM-006",
              gender: "Male",
              details: "",
            },
            {
              id: 8,
              name: "hauwa musa",
              admission_number: "ADM-002",
              gender: "Female",
              details: "Ready to import",
            },
            {
              id: 9,
              name: "olusegun akinola",
              admission_number: "ADM-007",
              gender: "Male",
              details: "",
            },
            {
              id: 10,
              name: "ngozi okafor",
              admission_number: "ADM-008",
              gender: "Female",
              details: "",
            },
            {
              id: 11,
              name: "tunde bakare",
              admission_number: "ADM-009",
              gender: "Male",
              details: "",
            },
            {
              id: 12,
              name: "amara eze",
              admission_number: "ADM-010",
              gender: "Female",
              details: "",
            },
            {
              id: 13,
              name: "yusuf danjuma",
              admission_number: "ADM-011",
              gender: "Male",
              details: "",
            },
            {
              id: 14,
              name: "sade ogundimu",
              admission_number: "",
              gender: "",
              details: "Duplicate",
            },
            {
              id: 15,
              name: "uche chukwu",
              admission_number: "ADM-012",
              gender: "Male",
              details: "",
            },
          ]}
        />

        <div className="flex gap-6 items-center *:flex-1">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={() =>
              router.push(
                "/super-admin/user-management/student-management?import-modal=true&current=2"
              )
            }
          >
            Back
          </Button>
          <Button
            // loading={isPending}
            //   type="submit"
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={handleProceed}
          >
            {`Commit ${validRows} valid rows`}
          </Button>
        </div>
      </>
    </FormModal>
  );
}