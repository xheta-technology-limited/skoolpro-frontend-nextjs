"use client";
import { Spinner } from "@/components/animations";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useApplyMapping } from "@/features/user-management/api/apply-mapping";
import { usePreviewMapping } from "@/features/user-management/api/preview-mapping";
import { useValidateMapping } from "@/features/user-management/api/validate-mapping";
import { useImportStaffStore } from "@/features/user-management/stores/import-staff.store";
import { ApplyMappingPayload } from "@/features/user-management/types/api/template";
import { titleCase, typedMappedKeys } from "@/lib/helpers";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function SecondModal() {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const open = searchParams.get("import-modal");
  const jobID = searchParams.get("job-id");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "2";

  const updateImportStore = useImportStaffStore((state) => state.updateData);

  const {
    data: jobData,
    isPending,
    isSuccess,
  } = usePreviewMapping(jobID || "", {
    enabled: !!jobID,
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending: isMutatePending } = useApplyMapping(jobID || "");

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");

  const handleProceed = () => {
    if (!jobData) {
      toast.error("Internal Client Error: No mapped data to preview");
      return;
    }
    if (!jobID) {
      toast.error("No current job ID found");
      return;
    }

    const payload: ApplyMappingPayload = {
      column_mapping: jobData.expected_columns,
    };
    mutate(payload, {
      onSuccess: (res) => {
        updateImportStore(res);
        router.push(
          `/super-admin/user-management/staff-management?import-modal=true&current=3&job-id=${jobID}`
        );
      },
    });
  };

  return (
    <FormModal
      title={"Import Staff"}
      onOpenChange={handleClose}
      open={isOpen}
      step={{ current: 2, total: 4 }}
    >
      <>
        <div>
          <Text scale={"content"} className="text-neutrals-900">
            Map your columns
          </Text>
          <Text scale={"caption"} mobile className="text-neutrals-700">
            Left is what your file had; right is the SkoolPro field it maps to.
            We’ve matched what we could — check the rest
          </Text>
        </div>

        <div className="flex flex-col mb-8 gap-4">
          <div className="flex gap-3 md:gap-8 *:flex-1">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <Text scale={"content"} className="text-neutrals-700">
                  YOUR FILE HEADER
                </Text>
                {isPending && <Spinner color="#5a5555" size={14} />}
              </div>
              {jobData &&
                typedMappedKeys(jobData.expected_columns).map((key) => (
                  <Input
                    key={key}
                    disabled
                    name={""}
                    value={jobData.expected_columns[key]}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-4">
              <Text scale={"content"} className="text-neutrals-700">
                SKOOLPRO FIELD
              </Text>
              {jobData?.file_headers.map((head) => (
                <Input key={head} disabled name={""} value={titleCase(head)} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center *:flex-1">
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
            Back
          </Button>
          <Button
            loading={isMutatePending}
            disabled={!isSuccess}
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            onClick={handleProceed}
          >
            Confirm Mapping
          </Button>
        </div>
      </>
    </FormModal>
  );
}
