"use client";

import { Controller, useFormContext } from "react-hook-form";
import { TickSquare } from "iconsax-reactjs";

import { Text } from "@/components/ui";
import { Input, Select, TextArea } from "@/components/ui/form";

export type DepartmentFormData = {
  name: string;
  code: string;
  description: string;
  head_staff_id: string;
  is_active: boolean;
};

export type DepartmentHeadOption = {
  value: string;
  label: string;
};

export function ActiveCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="flex size-5 items-center justify-center rounded-[4px] border border-neutrals-300 bg-white peer-checked:border-primary peer-checked:bg-primary-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500"
      >
        {checked && <TickSquare size={20} variant="Bulk" color="#010081" />}
      </span>
      <Text as="span" scale="content" className="text-neutrals-800">
        Active
      </Text>
    </label>
  );
}

export function DepartmentFormFields({
  headOptions = [],
  isHeadLoading = false,
}: {
  headOptions?: DepartmentHeadOption[];
  isHeadLoading?: boolean;
}) {
  const { control } = useFormContext<DepartmentFormData>();

  return (
    <>
      <Input name="name" label="Enter department name" />
      <Input name="code" label="Enter department code" />
      <TextArea
        name="description"
        label="Description"
        maxLength={200}
        className="!rounded-ml"
      />
      <Select
        name="head_staff_id"
        label="Select department head"
        options={headOptions}
        isLoading={isHeadLoading}
      />

      <Controller
        name="is_active"
        control={control}
        render={({ field }) => (
          <ActiveCheckbox
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </>
  );
}
