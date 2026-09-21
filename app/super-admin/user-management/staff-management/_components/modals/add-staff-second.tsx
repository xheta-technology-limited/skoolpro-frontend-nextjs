import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { Text } from "@/components/ui";
import { Checkbox, DatePicker, Input, Select } from "@/components/ui/form";
import { DAYS_OF_WEEK_OPTIONS, STATUS_OPTIONS } from "@/config/constants";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  STAFF_CATEGORY_OPTIONS,
} from "@/features/user-management/staff-management";
import { Button } from "@/components/ui/custom-button";
import { AddStaffSecondFormData } from "@/features/user-management/staff-management/schemas/add-staff-schema";
import { SuccessModal } from "@/components/common";
import { useListStaff } from "@/features/user-management/staff-management/api/list-staff";
import { createSelectOptions } from "@/lib/helpers";
import { Staff } from "@/features/user-management/staff-management/types/api/staff";
import { useListCampuses } from "@/features/campuses/api/list-campuses";
import { Campus } from "@/features/campuses/types/api/campus";

interface Props {
  methods: UseFormReturn<AddStaffSecondFormData>;
  onSubmit: () => void;
  isPending: boolean;
}
const SecondModal = ({ methods, onSubmit, isPending }: Props) => {
  const router = useProgressRouter();

  const searchParams = useSearchParams();
  const open = searchParams.get("add-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "2";
  const isSuccessOpen = current === "success";

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");
  const { data: allStaff, isPending: isStaffPending } = useListStaff();
  const { data: allCampus, isPending: isCampusPending } = useListCampuses({
    enabled: false,
  });

  const staffOptions = createSelectOptions<Staff, "id", "full_name">(
    allStaff?.data,
    "id",
    "full_name"
  );
  const campusOptions = createSelectOptions<Campus, "id", "name">(
    allCampus,
    "id",
    "name"
  );
  if (!isOpen) {
    return null;
  }
  return (
    <>
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={handleClose}
        subheading="The staff was added successfully"
      >
        <div>
          <Button onClick={handleClose} size="md">
            Dismiss
          </Button>
        </div>
      </SuccessModal>
      <FormModal title={"Add staff"} open={isOpen} onOpenChange={handleClose}>
        <FormProvider {...methods}>
          <form
            className="flex flex-col sm:h-auto gap-6 w-full"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <Text className="text-neutrals-700" scale={"content"}>
              ROLE & EMPLOYMENT
            </Text>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mb-4">
              <Select
                name="category"
                label="Category"
                options={STAFF_CATEGORY_OPTIONS}
              />
              <Select
                name="reporting_manager_id"
                label="Reporting manager"
                isLoading={isStaffPending}
                options={staffOptions || []}
              />

              <Select
                name="employment_type"
                label="Employment type"
                options={EMPLOYMENT_TYPE_OPTIONS}
              />
              <DatePicker
                name="employment_start_date"
                label="Employment starts"
              />

              <Select name="department" label="Department" options={[]} />
              <Select name="contract_type" label="Contract type" options={[]} />

              <Select
                name="staff_status"
                label="Staff status"
                options={STATUS_OPTIONS}
              />
              <Select
                name="campus_id"
                label="Main campus"
                isLoading={isCampusPending}
                options={campusOptions || []}
              />

              <Input name="payroll_number" label="Payroll number" />
              <Input name="work_location" label="Work location" />

              <DatePicker name="probation_end_date" label="Probation end" />
              <DatePicker name="contract_end_date" label="Contract end" />

              <Checkbox
                name="working_days"
                label="Working days"
                options={DAYS_OF_WEEK_OPTIONS}
              />
              <Input name="working_hours" label="Working hours" />
            </div>

            <div className="flex *:flex-1 gap-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                loading={isPending}
                type="submit"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              >
                Add Teacher
              </Button>
            </div>
          </form>
        </FormProvider>
      </FormModal>
    </>
  );
};

export default SecondModal;
