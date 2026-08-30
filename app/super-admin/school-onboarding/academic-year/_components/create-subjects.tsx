"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { Checkbox, DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";
import { AddSquare } from "iconsax-reactjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { DUMMY_CAMPUSES, DUMMY_CLASS_TEACHERS } from "../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import CatalogTable from "./catalog-table";
import AssignedSubjectsTable from "./assigned-subjects-table";
import { SuccessModal } from "@/components/common";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { useCreateSubject } from "@/features/academic-year/api/create-subject";
import {
  CreateSubjectRequest,
  createSubjectSchema,
} from "@/features/academic-year/schemas/create-subject-schema";
import { setFormErrors } from "@/lib/helpers/set-form-errors";
import { toast } from "sonner";
import { useListSubjects } from "@/features/academic-year/api/list-subjects";
import { Spinner } from "@/components/animations";
import {
  AssignSubjectFormData,
  assignSubjectSchema,
} from "@/features/academic-year/schemas/assign-subject-schema";

export default function CreateSubjects() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const addSubjectMethods = useForm<CreateSubjectRequest>({
    //placeholder, change when implementing api
    defaultValues: {},
    resolver: zodResolver(createSubjectSchema),
  });

  const assignSubjectMethods = useForm<AssignSubjectFormData>({
    //placeholder, change when implementing api
    defaultValues: {},
    resolver: zodResolver(assignSubjectSchema),
  });

  const { data: stages, isPending: isStagesPending } = useListStages({
    refetchOnWindowFocus: false,
  });
  const stageOptions =
    stages?.map((stage) => ({ label: stage.name, value: stage.id })) || [];

  const { mutate: createSubjectMutate, isPending: isCreateSubjectPending } =
    useCreateSubject();
  const onCreateSubject = (data: CreateSubjectRequest) => {
    createSubjectMutate(data, {
      onError: (res) => setFormErrors(addSubjectMethods.setError, res.errors),
      onSuccess: () => toast.success("Subject added successfully"),
    });
  };

  const { data: subjects, isPending: isSubjectsPending } = useListSubjects(
    undefined,
    { refetchOnWindowFocus: false }
  );

  const finish = () => {
    router.push(
      "/super-admin/school-onboarding/academic-year?open=true&step=success"
    );
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "4";
  const isSuccess = open === "true" && current === "success";

  const onCloseSuccessModal = () =>
    router.push("/super-admin/school-onboarding/academic-year");

  const assignSubject = () => {
    alert("Also do some API stuff");
  };

  return (
    <>
      <FormModal
        title="Create Subjects"
        open={isOpen}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        <div className="flex flex-col gap-4 max-w-full">
          <Text className="text-neutrals-700" scale={"content"}>
            Add a subject
          </Text>
          <FormProvider {...addSubjectMethods}>
            <form
              id="add-subject-form"
              className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
              onSubmit={addSubjectMethods.handleSubmit(onCreateSubject)}
            >
              <Input name="name" label="Enter subject name" />
              <Input name="code" label="Enter subject code" />
              <Select
                name="department"
                options={[]}
                label="Select department"
              />
              <Checkbox
                name="intended_stage_ids"
                options={stageOptions}
                label="Intended stage"
                isLoading={isStagesPending}
                isLoadingText="Fetching stages"
              />
            </form>
            <Button
              type="submit"
              form="add-subject-form"
              variant="secondary"
              loading={isCreateSubjectPending}
              size="sm"
              className="justify-self-end max-w-fit ml-auto"
            >
              <AddSquare variant="Bulk" size={16} className="text-primary" />
              <Text
                className="text-primary"
                weight={"standard"}
                scale={"caption"}
              >
                Add Subject
              </Text>
            </Button>
          </FormProvider>

          <CatalogTable data={subjects} isSubjectsPending={isSubjectsPending} />
          <>
            <Text className="text-neutrals-700" scale={"content"}>
              Assign subject to a level
            </Text>
            <FormProvider {...assignSubjectMethods}>
              <form
                id="assign-subject-form"
                className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
                onSubmit={assignSubjectMethods.handleSubmit(assignSubject)}
              >
                <Select name="name" options={DUMMY_CAMPUSES} label="Campus" />
                <Select
                  name="education_level_id"
                  options={[]}
                  label="Select class"
                />
                <Select
                  name="class_section_id"
                  options={[]}
                  label="Applies to"
                />
                <Select name="is_compulsory" options={[]} label="Compulsory" />
                <Select name="pass_mark" options={[]} label="Pass mark" />
                <Select name="is_active" options={[]} label="Active" />
              </form>
              <Button
                type="submit"
                form="assign-subject-form"
                variant="secondary"
                size="sm"
                className="justify-self-end max-w-fit ml-auto"
              >
                <AddSquare variant="Bulk" size={16} className="text-primary" />
                <Text
                  className="text-primary"
                  weight={"standard"}
                  scale={"caption"}
                >
                  Assign Subject
                </Text>
              </Button>
            </FormProvider>
          </>
          <Text className="text-neutrals-700" scale={"content"}>
            Assigned to class_name_here
          </Text>
          <AssignedSubjectsTable />
          <div className="flex *:flex-1 gap-6">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              onClick={() =>
                router.replace("/super-admin/school-onboarding/academic-year")
              }
            >
              Cancel
            </Button>
            <Button
              onClick={finish}
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Finish Setup
            </Button>
          </div>
        </div>
      </FormModal>

      <SuccessModal
        onClose={onCloseSuccessModal}
        isOpen={isSuccess}
        heading="Successful"
        subheading="Academic setup has been added successfully."
      >
        <Button size="lg" onClick={onCloseSuccessModal}>
          Dismiss
        </Button>
      </SuccessModal>
    </>
  );
}
