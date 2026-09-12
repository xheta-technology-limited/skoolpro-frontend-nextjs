"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import {
  EditTeacherFormData,
  editTeacherSchema,
} from "@/features/user-management/staff-management/schemas/edit-teacher-profile-schema";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
export default function EditMode({ setEditMode }: Props) {
  const methods = useForm<EditTeacherFormData>({
    resolver: zodResolver(editTeacherSchema),
  });
  const onSubmit = () => {
    alert("Saved successfully");
    setEditMode(false);
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Text className="text-neutrals-700">TEACHING PROFILE</Text>

        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" form="edit-user-form">
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
          <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
            <Input
              name="teacher_registration_number"
              label="Teacher reg. number"
            />
            <Input name="max_teaching_load" label="Period per week" />
            <Input name="form_class_section_id" label="Register class" />
            <Input name="specialist_skills" label="Skills" />
            <Input name="curriculum_experience" label="Curriculum experience" />
          </div>
        </form>
      </FormProvider>
    </>
  );
}