import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { GENDER_SELECT_OPTIONS } from "@/config/constants";
import { Button } from "@/components/ui/custom-button";
import {
  AddStaffSecondFormData,
  addStaffSecondSchema,
} from "@/features/user-management/staff-management/schemas/add-staff-schema";
import { SuccessModal } from "@/components/common";

const SecondModal = () => {
  const router = useProgressRouter();
  const methods = useForm<AddStaffSecondFormData>({
    defaultValues: {},
    resolver: zodResolver(addStaffSecondSchema),
  });

  const searchParams = useSearchParams();
  const open = searchParams.get("add-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "2";
  const isSuccessOpen = current === "success";

  const onSubmit = () =>
    router.push(
      "/super-admin/user-management/staff-management?add-modal=true&current=success"
    );

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");
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
              <Select name="category" label="Category" options={[]} />
              <Select
                name="reporting_manager_id"
                label="Reporting manager"
                options={[]}
              />

              <Select
                name="employment_type"
                label="Employment type"
                options={[]}
              />
              <DatePicker
                name="employment_start_date"
                label="Employment starts"
              />

              <Select name="department" label="Department" options={[]} />
              <Select name="contract_type" label="Contract type" options={[]} />

              <Select name="staff_status" label="Staff status" options={[]} />
              <Select name="campus_id" label="Main campus" options={[]} />

              <Input name="payroll_number" label="Payroll number" />
              <Select name="work_location" label="Work location" options={[]} />

              <DatePicker name="probation_end_date" label="Probation end" />
              <DatePicker name="contract_end_date" label="Contract end" />

              <Select name="working_days" label="Working days" options={[]} />
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
                // loading={isPending}
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
