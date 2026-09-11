import Image from "next/image";
import { UserEdit } from "iconsax-reactjs";
import { staff } from "../constants";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { GENDER_SELECT_OPTIONS } from "@/config/constants";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
export default function EditMode({ setEditMode }: Props) {
  const methods = useForm({});
  const onSubmit = () => {
    alert("Saved successfully");
    setEditMode(false);
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
              <Input
                name="religion"
                label="Enter religion(doesn't exist on bakend)"
              />
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
              <Input name="category" label="Enter category" />
              <Input
                name="reporting_manager_id"
                label="Enter reporting manager"
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
                name="emergency_phone_number"
                label="Enter emergency phone number"
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
