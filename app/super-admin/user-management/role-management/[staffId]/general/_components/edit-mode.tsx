import Image from "next/image";
import { UserEdit } from "iconsax-reactjs";
import { staff } from "../constants";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { GENDER_SELECT_OPTIONS } from "@/config/constants";
import { Dispatch, SetStateAction } from "react";
import { Staff } from "@/features/user-management/staff-management/types/api/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditStaffFormData,
  editStaffSchema,
} from "@/features/user-management/staff-management/schemas/edit-staff-schema";
import { useEditStaff } from "@/features/user-management/staff-management/api/edit-staff";
import { toast } from "sonner";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { STAFF_CATEGORY_OPTIONS } from "@/features/user-management/staff-management";
import { useListStaff } from "@/features/user-management/staff-management/api/list-staff";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  profileData: Staff;
}
const getFormDefaultValues = (data: Staff): EditStaffFormData =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value ?? undefined])
  ) as unknown as EditStaffFormData;

export default function EditMode({ setEditMode, profileData }: Props) {
  const methods = useForm<EditStaffFormData>({
    defaultValues: getFormDefaultValues(profileData),
    resolver: zodResolver(editStaffSchema),
  });

  const { isLoading: isStaffLoading, data: staffData } = useListStaff();
  const staffOptions = createSelectOptions<Staff, "id", "full_name">(
    staffData?.data,
    "id",
    "full_name"
  );

  const { mutate, isPending } = useEditStaff();
  const onSubmit = (data: EditStaffFormData) => {
    mutate(
      { id: profileData.id, data: data },
      {
        onSuccess: () => {
          toast.success("Updated successfully");
          setEditMode(false);
        },
        onError: (res) => {
          setFormErrors(methods.setError, res?.errors);
        },
      }
    );
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <Text className="text-neutrals-700">STAFF DETAILS</Text>

        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="edit-user-form"
            loading={isPending}
          >
            Save
          </Button>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          id="edit-user-form"
        >
          <div className="flex gap-4 flex-wrap">
            {/* Profile photo */}
            <div className="relative h-71 w-71 flex items-center justify-center shrink-0 overflow-hidden rounded-ml border-4 border-primary">
              <Image
                src={staff.photoUrl}
                alt={`${staff.firstName} ${staff.lastName}`}
                fill
                className="object-cover"
              />
            </div>

            {/* Detail fields grid */}
            <div className="rounded-ml bg-white min-w-76.75 gap-4 p-2 flex-1 grid grid-cols-2 content-start">
              <Input name="first_name" label="Enter first name" />
              <Input name="middle_name" label="Enter middle name" />
              <Input name="last_name" label="Enter last name" />
              <Input name="religion" label="Enter religion" />
              <Select
                name="gender"
                label="Select sex"
                options={GENDER_SELECT_OPTIONS}
              />
              <Input
                name="date_of_birth"
                label="Enter date of birth"
                type="date"
              />
              <Input name="nationality" label="Enter nationality" />
              <Select
                name="marital_status"
                label="Select marital status"
                options={[]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Text className="text-neutrals-700">ROLE & EMPLOYMENT DETAILS</Text>

            <div className="rounded-ml bg-white gap-4 p-2 grid grid-cols-2 content-start">
              <Input name="staff_number" label="Enter staff number" />
              <Input
                name="national_reg_number"
                label="Enter national/prof. no."
              />
              <Select
                name="category"
                label="Enter category"
                options={STAFF_CATEGORY_OPTIONS}
              />
              <Select
                name="reporting_manager_id"
                label="Enter reporting manager"
                options={staffOptions || []}
                isLoading={isStaffLoading}
                isLoadingText="Loading"
              />
              <Select
                name="employment_type"
                label="Select employment type"
                options={[]}
              />
              <Input
                name="employment_start_date"
                label="Enter employment start date"
                type="date"
              />
              <Select
                name="department"
                label="Select department"
                options={[]}
              />
              <Select
                name="contract_type"
                label="Select contract type"
                options={[]}
              />
              <Select
                name="staff_status"
                label="Select staff status"
                options={[]}
              />
              <Select name="campus_id" label="Select campus" options={[]} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Text className="text-neutrals-700">CONTACT DETAILS</Text>

            <div className="rounded-ml bg-white gap-4 p-2 grid grid-cols-2 content-start">
              <Input name="address" label="Enter home address" />
              <Input name="email" label="Enter email address" />
              <Input name="phone" label="Enter phone number" />
              <Input
                name="emergency_phone"
                label="Enter emergency phone number"
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
