"use client";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import ImportedTable from "../tables/imported-table";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCommitImport } from "@/features/user-management/api/commit-import";
import { Entity } from "@/features/user-management/types/api/common";
import {
  AnyColumnMapping,
  ColumnMappingFor,
} from "@/features/user-management/types/import";
import { DocumentDownload } from "iconsax-reactjs";
import { useGetErrorReport } from "@/features/user-management/api/get-error-report";
import { ImportRecord } from "@/features/user-management/types/api/template";

type Props<E extends Entity> = {
  title: string;
  nextStepUrl: string;
  handleClose: () => void;
  tableColumns: string[];
  tableKeys: string[];
  storeData: Partial<ImportRecord<AnyColumnMapping>>;
  updateStoreData: (record: ImportRecord<AnyColumnMapping>) => void;
  invalidateQueryKeys: readonly string[];
  module: E;
};
export default function ThirdModal<E extends Entity>({
  nextStepUrl,
  handleClose,
  title,
  tableColumns,
  tableKeys,
  storeData,
  invalidateQueryKeys,
  updateStoreData,
  module,
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

  const handleProceed = () => {
    if (!jobID) {
      toast.error("No current job id found");
      return;
    }

    mutate(undefined, {
      onSuccess: (res) => {
        updateStoreData(res);
        queryClient.invalidateQueries({
          queryKey: invalidateQueryKeys,
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
    if (storeData.error_count && storeData.error_count > 0) {
      toast.info("Errors detected; please download the error file.");
    }
  }, [storeData]);

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
            {`Every row checked against the field rules and against existing
            ${module}. Fix invalid rows in your file and re-upload, or carry on and
            commit the valid ones.`}
          </Text>

          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <StatusBadge
                variant="orange"
                data={`${storeData?.skipped_count} Skipped`}
              />
              <StatusBadge
                variant="red"
                data={`${storeData?.error_count} Errors`}
              />
            </div>

            {(storeData?.error_count ?? 0) > 0 && (
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
          dataToMap={storeData}
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
                `${nextStepUrl}?import-modal=true&current=2&job-id=${jobID}`
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
