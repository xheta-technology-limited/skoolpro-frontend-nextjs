"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  EditTeacherFormData,
  editTeacherSchema,
} from "@/features/user-management/staff-management/schemas/edit-teacher-profile-schema";
import { useUpdateTeachingProfile } from "@/features/user-management/staff-management/api/update-teaching-profile";
import {
  Section,
  Subject,
  TeacherProfile,
  UpdateTeachingProfileData,
} from "@/features/user-management/staff-management/types/api/teaching-profile";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { ClassSection, EducationLevel } from "@/features/academic-year";
import { useListClassSections } from "@/features/academic-year/api/list-class-sections";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  profileData: TeacherProfile;
  subjects: Subject[];
  sectionIds: Section[];
}
export default function EditMode({
  setEditMode,
  profileData,
  subjects,
  sectionIds,
}: Props) {
  const { staffId } = useParams<{ staffId: string }>();
  const { mutate, isPending } = useUpdateTeachingProfile();
  const { data: classesData, isPending: isClassesPending } =
    useListClassSections();

  const classesOptions = createSelectOptions<ClassSection, "id", "name">(
    classesData,
    "id",
    "name"
  );

  const methods = useForm<EditTeacherFormData>({
    defaultValues: {
      teacher_registration_number:
        profileData.teacher_registration_number ?? undefined,
      max_teaching_load: profileData.max_teaching_load?.toString() ?? undefined,
      form_class_section_id: profileData.form_class_section_id ?? undefined,
      specialist_skills: profileData.specialist_skills ?? undefined,
      curriculum_experience: profileData.curriculum_experience ?? undefined,
    },
    resolver: zodResolver(editTeacherSchema),
  });

  const onSubmit = (data: EditTeacherFormData) => {
    const payload: UpdateTeachingProfileData = {
      teacher_registration_number: data.teacher_registration_number,
      form_class_section_id: data.form_class_section_id,
      max_teaching_load: data.max_teaching_load
        ? Number(data.max_teaching_load)
        : undefined,
      specialist_skills: data.specialist_skills,
      curriculum_experience: data.curriculum_experience,
      subjects,
      sections: sectionIds,
    };

    mutate(
      { staffId, data: payload },
      {
        onSuccess: () => {
          toast.success("Teaching profile updated");
          setEditMode(false);
        },
        onError: (res) => setFormErrors(methods.setError, res.errors),
      }
    );
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
          <div className="rounded-ml bg-white gap-4 p-2 grid grid-cols-2 content-start">
            <Input
              name="teacher_registration_number"
              label="Teacher reg. number"
            />
            <Input name="max_teaching_load" label="Period per week" />
            <Select
              name="form_class_section_id"
              label="Register class"
              isLoading={isClassesPending}
              options={classesOptions || []}
            />
            <Input name="specialist_skills" label="Skills" />
            <Input name="curriculum_experience" label="Curriculum experience" />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
