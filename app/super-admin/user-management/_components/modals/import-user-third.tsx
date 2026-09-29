"use client";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import ImportedTable from "../tables/imported-table";
import { useImportStaffStore } from "@/features/user-management/stores/import-staff.store";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { staffKeys } from "@/features/user-management/staff-management/api/query-keys";
import { useCommitImport } from "@/features/user-management/api/commit-import";
import { Entity } from "@/features/user-management/types/api/common";
import { ColumnMappingFor } from "@/features/user-management/types/import";
import { DocumentDownload } from "iconsax-reactjs";
import { useGetErrorReport } from "@/features/user-management/api/get-error-report";

type Props<E extends Entity> = {
  title: string;
  nextStepUrl: string;
  handleClose: () => void;
  tableColumns: string[];
  tableKeys: string[];
  module: E;
};
export default function ThirdModal<E extends Entity>({
  nextStepUrl,
  handleClose,
  title,
  tableColumns,
  tableKeys,
}: Props<E>) {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const queryClient = useQueryClient();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "3";
  const jobID = searchParams.get("job-id");

  const { mutate, isPending } = useCommitImport<ColumnMappingFor<E>>(
    jobID || ""
  );

  const data = useImportStaffStore((s) => s.data);
  const updateImportStore = useImportStaffStore((state) => state.updateData);

  const handleProceed = () => {
    if (!jobID) {
      toast.error("No current job id found");
      return;
    }

    mutate(undefined, {
      onSuccess: (res) => {
        updateImportStore(res);
        queryClient.invalidateQueries({
          queryKey: staffKeys.all,
        });
        router.push(
          `${nextStepUrl}?import-modal=true&current=4&job-id=${jobID}`
        );
      },
    });
  };

  const { isFetching: isTemplateFetching, refetch: downloadErrors } =
    useGetErrorReport(jobID || "", {
      enabled: false,
      refetchOnWindowFocus: false,
    });

  const handleDownload = async () => {
    if (!jobID) return;
    const { data: template } = await downloadErrors();
    if (!template) return;

    const url = URL.createObjectURL(template);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import_errors.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (data.error_count && data.error_count > 0) {
      toast.info("Errors detected; please download the error file.");
    }
  }, [data]);

  return (
    <FormModal
      title={title}
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
            staff. Fix invalid rows in your file and re-upload, or carry on and
            commit the valid ones.
          </Text>

          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <StatusBadge
                variant="orange"
                data={`${data?.skipped_count} Skipped`}
              />
              <StatusBadge variant="red" data={`${data?.error_count} Errors`} />
            </div>

            {(data?.error_count ?? 0) > 0 && (
              <Button
                variant="secondary"
                leftIcon={
                  <DocumentDownload size={16} className="text-error-200" />
                }
                className="h-max"
                onClick={handleDownload}
                loading={isTemplateFetching}
              >
                Download Error report
              </Button>
            )}
          </div>
        </div>

        <ImportedTable
          dataToMap={data}
          columns={tableColumns}
          keys={tableKeys}
        />

        <div className="flex gap-6 items-center *:flex-1">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={() =>
              router.push(
                `/super-admin/user-management/staff-management?import-modal=true&current=2&job-id=${jobID}`
              )
            }
          >
            Back
          </Button>
          <Button
            loading={isPending}
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={handleProceed}
          >
            {`Commit rows`}
          </Button>
        </div>
      </>
    </FormModal>
  );
}
