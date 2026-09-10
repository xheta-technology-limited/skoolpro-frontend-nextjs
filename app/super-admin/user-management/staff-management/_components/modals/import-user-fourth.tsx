"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import ImportedTable from "../tables/imported-staff";
import clsx from "clsx";

const jobSummary = [
  { label: "Job Status", value: "Completed" },
  { label: "Total Rows", value: "15" },
  { label: "Imported", value: "12" },
  { label: "Completed at", value: "2/9/2026 - 10:30 AM" },
];

export default function FourthModal() {
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
      step={{ current: 4, total: 4 }}
    >
      <>
        <div>
          <Text scale={"content"} className="text-neutrals-900">
            Import complete
          </Text>
          <Text scale={"caption"} mobile className="text-neutrals-700">
            The valid rows are now staff records. Each row imported in its own
            transaction, so one failure never blocks the rest.
          </Text>
        </div>

        <div className="flex gap-4 items-center mb-8">
          <StatusBadge variant="green" data="12 Valid" />
          <StatusBadge variant="orange" data="2 Duplicates" />
          <StatusBadge variant="red" data="1 Invalid" />
        </div>

        <TableWrapper className="mb-4">
          <Table>
            <TableBody>
              {jobSummary.map((row, index) => (
                <TableRow
                  key={row.label}
                  className={clsx(
                    "text-neutrals-900",
                    index === jobSummary.length - 1 && "[&>td]:border-b-0"
                  )}
                >
                  <TableCell className="text-neutrals-500">
                    {row.label}
                  </TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <div className="flex gap-6 items-center *:flex-1 mb-8">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={() =>
              router.push(
                "/super-admin/user-management/staff-management?import-modal=true&current=1"
              )
            }
          >
            Import another File
          </Button>
          <Button
            // loading={isPending}
            //   type="submit"
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={handleClose}
          >
            View Staff Directory
          </Button>
        </div>

        <Button
          onClick={() => alert("not implemented")}
          variant="tertiary"
          className="text-error-200 border-0 m-auto"
        >
          Roll back this import
        </Button>
      </>
    </FormModal>
  );
}
