"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { DragNDrop, Input } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentDownload } from "iconsax-reactjs";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function SecondModal() {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "2";

  const methods = useForm({
    defaultValues: {},
    //   resolver: zodResolver(addStaffFirstSchema),
  });

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");

  const handleProceed = () => {
    router.push(
      "/super-admin/user-management/staff-management?import-modal=true&current=3"
    );
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
            <Text scale={"content"} className="text-neutrals-700">
              YOUR FILE HEADER
            </Text>
            <Text scale={"content"} className="text-neutrals-700">
              SKOOLPRO FIELD
            </Text>
          </div>
          {/* Here would be where you map through everything */}
          <div className="flex gap-3 md:gap-8 *:flex-1">
            <Input disabled name={""} value={"Nothing fr"} />
            <Input disabled name={""} value={"Nothing fr"} />
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
            // loading={isPending}
            //   type="submit"
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
