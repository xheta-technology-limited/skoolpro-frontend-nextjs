"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useImportStudentsStore } from "@/features/user-management/stores/import-student.store";
import { titleCase } from "@/lib/helpers";
import { useRollbackImport } from "@/features/user-management/api/rollback-import";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "@/features/user-management/student-management/api/query-keys";

interface Props {
  title: string;
  importAnotherFn: () => void;
  handleClose: () => void;
}
export default function StudentFourthModal({
  title,
  importAnotherFn,
  handleClose,
}: Props) {
  const searchParams = useSearchParams();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "4";
  const jobID = searchParams.get("job-id");

  const queryClient = useQueryClient();

  const data = useImportStudentsStore((s) => s.data);

  const { mutate, isPending } = useRollbackImport(jobID || "");

  const handleRollback = () => {
    if (!jobID) {
      toast.error("No current job ID found");
      return;
    }
    mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: studentKeys.all,
        });
        toast.success("Success!");
        handleClose();
      },
    });
  };

  const rows: [string, string | number][] = [
    ["Job Status", titleCase(data.status || "") || "-"],
    ["Total Rows", data.total_rows || "-"],
    ["Imported", data.success_count || "-"],
    ["Completed at", data.completed_at || "-"],
  ];

  return (
    <FormModal
      title={title}
      onOpenChange={handleClose}
      open={isOpen}
      step={{ current: 4, total: 4 }}
    >
      <>
        <div>
          <Text scale={"content"} className="text-neutrals-900">
            Import complete
          </Text>
          <Text scale={"caption"} mobile className="text-neutrals-700 mb-4">
            The valid rows are now student records. Each row imported in its own
            transaction, so one failure never blocks the rest.
          </Text>

          <div className="flex gap-4 items-center">
            <StatusBadge variant="green" data={`${data.success_count} Valid`} />
            <StatusBadge
              variant="orange"
              data={`${data.skipped_count} Skipped`}
            />
            <StatusBadge variant="red" data={`${data.error_count} Errors`} />
          </div>
        </div>

        <TableWrapper className="mb-4">
          <Table>
            <TableBody>
              {rows.map(([label, value]) => (
                <TableRow key={label} className={clsx("text-neutrals-900")}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <div>
          <div className="flex gap-6 items-center *:flex-1 mb-8">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              onClick={importAnotherFn}
            >
              Import another File
            </Button>
            <Button
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              onClick={handleClose}
            >
              View Student Directory
            </Button>
          </div>

          <Button
            onClick={() => handleRollback()}
            variant="tertiary"
            className="border-0 m-auto"
            loading={isPending}
          >
            <Text scale={"highlight"} className="text-error-200">
              Roll back this import
            </Text>
          </Button>
        </div>
      </>
    </FormModal>
  );
}