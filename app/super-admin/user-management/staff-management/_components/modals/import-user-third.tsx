"use client";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import ImportedTable from "../tables/imported-staff";

export default function ThirdModal() {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "3";

  const validRows = "Nan";

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");

  const handleProceed = () => {
    router.push(
      "/super-admin/user-management/staff-management?import-modal=true&current=4"
    );
  };

  return (
    <FormModal
      title={"Import Staff"}
      onOpenChange={handleClose}
      open={isOpen}
      step={{ current: 3, total: 4 }}
    >
      <>
        <div>
          <Text scale={"content"} className="text-neutrals-900">
            Validate
          </Text>
          <Text scale={"caption"} mobile className="text-neutrals-700">
            Every row checked against the field rules and against existing
            staff. Fix invalid rows in your file and re-upload, or carry on and
            commit the valid ones.
          </Text>
        </div>

        <div className="flex gap-4 items-center mb-8">
          <StatusBadge variant="green" data="12 Valid" />
          <StatusBadge variant="orange" data="2 Duplicates" />
          <StatusBadge variant="red" data="1 Invalid" />
        </div>

        <ImportedTable
          dataToMap={[
            {
              id: 1,
              name: "adewale johnson",
              staff_number: "STF-001",
              category: "Teaching",
              details: "",
            },
            {
              id: 2,
              name: "fatima abdullahi",
              staff_number: "STF-002",
              category: "Non-Teaching",
              details: "",
            },
            {
              id: 3,
              name: "chinedu okoro",
              staff_number: "STF-003",
              category: "Teaching",
              details: "",
            },
            {
              id: 4,
              name: "grace amen",
              staff_number: "STF-001",
              category: "Teaching",
              details: "Duplicate staff number",
            },
            {
              id: 5,
              name: "mohammed ali",
              staff_number: "STF-004",
              category: "Administration",
              details: "",
            },
            {
              id: 6,
              name: "blessing ifeoma",
              staff_number: "STF-005",
              category: "Non-Teaching",
              details: "",
            },
            {
              id: 7,
              name: "emeka nwosu",
              staff_number: "STF-006",
              category: "Teaching",
              details: "",
            },
            {
              id: 8,
              name: "hauwa musa",
              staff_number: "STF-002",
              category: "Administration",
              details: "Duplicate staff number",
            },
            {
              id: 9,
              name: "olusegun akinola",
              staff_number: "STF-007",
              category: "Teaching",
              details: "",
            },
            {
              id: 10,
              name: "ngozi okafor",
              staff_number: "STF-008",
              category: "Non-Teaching",
              details: "",
            },
            {
              id: 11,
              name: "tunde bakare",
              staff_number: "STF-009",
              category: "Teaching",
              details: "",
            },
            {
              id: 12,
              name: "amara eze",
              staff_number: "STF-010",
              category: "Administration",
              details: "",
            },
            {
              id: 13,
              name: "yusuf danjuma",
              staff_number: "STF-011",
              category: "Teaching",
              details: "",
            },
            {
              id: 14,
              name: "sade ogundimu",
              staff_number: "",
              category: "",
              details: "Missing staff number and category",
            },
            {
              id: 15,
              name: "uche chukwu",
              staff_number: "STF-012",
              category: "Non-Teaching",
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
                "/super-admin/user-management/staff-management?import-modal=true&current=2"
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
