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
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { titleCase } from "@/lib/helpers";
import { useRollbackImport } from "@/features/user-management/api/rollback-import";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ImportRecord } from "@/features/user-management/types/api/template";
import { AnyColumnMapping } from "@/features/user-management/types/import";
import { Entity } from "@/features/user-management/types/api/common";

interface Props {
  title: string;
  storeData: Partial<ImportRecord<AnyColumnMapping>>;
  importAnotherFn: () => void;
  handleClose: () => void;
  invalidateQueryKeys: readonly string[];
  module: Entity;
}
export default function FourthModal({
  title,
  importAnotherFn,
  handleClose,
  invalidateQueryKeys,
  storeData,
  module,
}: Props) {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "4";
  const jobID = searchParams.get("job-id");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useRollbackImport(jobID || "");

  const handleRollback = () => {
    if (!jobID) {
      toast.error("No current job ID found");
      return;
    }
    mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: invalidateQueryKeys,
        });
        toast.success("Success!");
        handleClose();
      },
    });
  };
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
            {`The valid rows are now ${module} records. Each row imported in its own
            transaction, so one failure never blocks the rest.`}
          </Text>

          <div className="flex gap-4 items-center">
            <StatusBadge
              variant="green"
              data={`${storeData.success_count} Valid`}
            />
            <StatusBadge
              variant="orange"
              data={`${storeData.skipped_count} Skipped`}
            />
            <StatusBadge
              variant="red"
              data={`${storeData.error_count} Errors`}
            />
          </div>
        </div>

        <TableWrapper className="mb-4">
          <Table>
            <TableBody>
              <TableRow
                className={clsx(
                  "text-neutrals-900"
                  // index === jobSummary.length - 1 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>Job Status</TableCell>
                <TableCell>
                  {titleCase(storeData.status || "") || "-"}
                </TableCell>
              </TableRow>

              <TableRow
                className={clsx(
                  "text-neutrals-900"
                  // index === jobSummary.length - 1 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>Total Rows</TableCell>
                <TableCell>{storeData.total_rows || "-"}</TableCell>
              </TableRow>

              <TableRow
                className={clsx(
                  "text-neutrals-900"
                  // index === jobSummary.length - 1 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>Imported</TableCell>
                <TableCell>{storeData.success_count || "-"}</TableCell>
              </TableRow>

              <TableRow
                className={clsx(
                  "text-neutrals-900"
                  // index === jobSummary.length - 1 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>Completed at</TableCell>
                <TableCell>{storeData.completed_at || "-"}</TableCell>
              </TableRow>
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
              // loading={isPending}
              //   type="submit"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              onClick={handleClose}
            >
              {`View ${titleCase(module)} Directory`}
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
