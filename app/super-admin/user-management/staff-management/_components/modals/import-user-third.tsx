"use client";
import { StatusBadge } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import ImportedTable from "../tables/imported-staff";
import { useGetSingleImport } from "@/features/user-management/api/get-single-import";
import { Spinner } from "@/components/animations";
import { useImportStaffStore } from "@/features/user-management/stores/import-staff.store";
import { useEffect } from "react";
import { useValidateMapping } from "@/features/user-management/api/validate-mapping";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { staffKeys } from "@/features/user-management/staff-management/api/query-keys";
import { useCommitImport } from "@/features/user-management/api/commit-import";

export default function ThirdModal() {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const queryClient = useQueryClient();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "3";
  const jobID = searchParams.get("job-id");

  const { mutate, isPending } = useCommitImport(jobID || "");

  const data = useImportStaffStore((s) => s.data);
  const updateImportStore = useImportStaffStore((state) => state.updateData);

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");

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
          `/super-admin/user-management/staff-management?import-modal=true&current=4&job-id=${jobID}`
        );
      },
    });
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
          <Text scale={"caption"} mobile className="text-neutrals-700 mb-4">
            Every row checked against the field rules and against existing
            staff. Fix invalid rows in your file and re-upload, or carry on and
            commit the valid ones.
          </Text>

          <div className="flex gap-4 items-center">
            <StatusBadge
              variant="orange"
              data={`${data?.skipped_count} Skipped`}
            />
            <StatusBadge variant="red" data={`${data?.error_count} Errors`} />
          </div>
        </div>

        <ImportedTable dataToMap={data} />

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
