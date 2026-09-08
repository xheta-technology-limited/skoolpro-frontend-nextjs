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
  AddStaffFirstFormData,
  addStaffFirstSchema,
} from "@/features/user-management/staff-management/schemas/add-staff-schema";

const FirstModal = () => {
  const router = useProgressRouter();
  const methods = useForm<AddStaffFirstFormData>({
    defaultValues: {},
    resolver: zodResolver(addStaffFirstSchema),
  });

  const searchParams = useSearchParams();
  const open = searchParams.get("add-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "1";

  const onSubmit = () =>
    router.push(
      "/super-admin/user-management/staff-management?add-modal=true&current=2"
    );

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");
  return (
    <FormModal title={"Add staff"} open={isOpen} onOpenChange={handleClose}>
      <FormProvider {...methods}>
        <form
          className="flex flex-col sm:h-auto gap-6 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Text className="text-neutrals-700" scale={"content"}>
            STAFF IDENTITY
          </Text>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mb-4">
            <Input name="staff_number" label="Staff number" />
            <Input name="title" label="Title" />

            <Input name="first_name" label="Enter first name" />
            <Input name="middle_name" label="Enter middle name" />

            <Input name="last_name" label="Enter last name" />
            <Input name="national_reg_number" label="National/prof. reg. no." />

            <Select
              options={GENDER_SELECT_OPTIONS}
              name="gender"
              label="Select gender"
            />
            <DatePicker name="date_of_birth" label="D.O.B" />

            <Input name="nationality" label="Nationality" />
            <Input name="marital_status" label="Marital status" />
          </div>
          <Text className="text-neutrals-700" scale={"content"}>
            CONTACT DETAILS
          </Text>
          <div className="flex flex-col gap-4 mb-4">
            <Input name="email" label="Enter email address" />
            <Input name="phone" label="Enter phone number" />
            <Input name="address" label="Enter home address" />
            <Input
              name="emergency_phone_number"
              label="Enter emergency phone number"
            />
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
              Proceed
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
};

export default FirstModal;
