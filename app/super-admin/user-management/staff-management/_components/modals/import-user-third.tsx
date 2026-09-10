"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { DragNDrop, Input } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { DocumentDownload } from "iconsax-reactjs";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function ThirdModal() {
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
    <FormModal title={"Import Staff"} onOpenChange={handleClose} open={isOpen}>
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
          <StatusInfo status="Valid" count={12} color="green" />
          <StatusInfo status="Duplicates" count={2} color="orange" />
          <StatusInfo status="Invalid" count={1} color="red" />
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

interface StatusProps {
  status: string; //make this a union of the specific status strings
  count: number;
  color: "red" | "green" | "orange";
}
const StatusInfo = ({ status, count, color }: StatusProps) => {
  const colors =
    color === "green"
      ? "text-success-200 bg-[#EDFDFA]"
      : status === "orange"
      ? "bg-[#FDF6EC] text-warning-200"
      : status === "red"
      ? "bg-[#FDF6EC] text-error-200"
      : "";
  const details = status === "green" ? "Active" : "On leave";
  return (
    <Text
      as="span"
      scale="footnote"
      weight="standard"
      className={clsx("rounded-[12px] px-2.5 py-0.5", colors)}
    >
      {`${count} ${status}`}
    </Text>
  );
};
