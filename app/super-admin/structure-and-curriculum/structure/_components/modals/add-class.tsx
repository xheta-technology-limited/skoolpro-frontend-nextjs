"use client";

import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useCreateArm } from "@/features/academic-year/api/create-arm";
import { useUpdateArm } from "@/features/academic-year/api/update-arm";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateArmFormData,
  createArmSchema,
} from "@/features/academic-year/schemas/create-arm";
import { useListLevels } from "@/features/academic-year/api/list-levels";

interface Props {
  defaults?: CreateArmFormData & { level_id?: string; arm_id?: string };
}

export default function AddClass({ defaults }: Props) {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();
  const armId = searchParams.get("arm-id") || defaults?.arm_id;
  const levelFromQuery = searchParams.get("level-id");
  const [formLevel, setFormLevel] = useState("");

  const methods = useForm<CreateArmFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createArmSchema),
  });

  const selectedLevel =
    formLevel || levelFromQuery || (defaults as any)?.level_id;

  const { mutate: createMutate, isPending: isCreatePending } = useCreateArm(
    selectedLevel || ""
  );
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateArm(
    selectedLevel || ""
  );
  const isOpen =
    params.includes("/structure-and-curriculum") &&
    searchParams.get("add-class") === "true";
  const isEditMode = isOpen && !!armId;

  const { data: levelsData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levelsData, "id", "name");

  const onCreate = (data: CreateArmFormData) => {
    const levelId = selectedLevel;
    if (!levelId) {
      toast.error("Please select a level");
      return;
    }
    const { level_id, ...payload } = data as any;
    createMutate(payload, {
      onSuccess: () => {
        methods.reset();
        handleClose();
      },
      onError: (err: any) => {
        setFormErrors(methods.setError, err.errors);
      },
    });
  };

  const onUpdate = (data: CreateArmFormData) => {
    if (!armId) {
      toast.error("No arm ID found");
      return;
    }
    const levelId = (data as any).level_id || selectedLevel;
    if (!levelId) {
      toast.error("Please select a level");
      return;
    }
    const { level_id, ...payload } = data as any;
    updateMutate(
      { armId, level: levelId, data: payload },
      {
        onSuccess: () => {
          toast.success("Updated!");
          handleClose();
        },
        onError: (err: any) => {
          setFormErrors(methods.setError, err.errors);
        },
      }
    );
  };

  const onSubmit = (data: CreateArmFormData) => {
    if (isEditMode) {
      onUpdate(data);
    } else {
      onCreate(data);
    }
  };

  useEffect(() => {
    methods.reset(defaults ?? {});
  }, [defaults]);

  const handleClose = () =>
    router.push("/super-admin/structure-and-curriculum/structure?tab=classes");
  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title={isEditMode ? "Edit Class" : "Add Class"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="class-create"
          className="flex flex-col gap-4 w-full"
        >
          <>
            {!isEditMode && (
              <Select
                name="level_id"
                label="Select level"
                onChange={(e) => {
                  console.log("le level is: ", e);
                  setFormLevel(e);
                }}
                options={levelOptions || []}
                isLoading={isLevelsPending}
                value={formLevel}
              />
            )}
            <Input name="name" label="Enter name" />
            <Input name="code" label="Enter code" />
            <Input name="staff_id" label="Enter class teacher" />
            <Input name="capacity" label="Enter capacity" />
          </>
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isCreatePending || isUpdatePending}
            type="submit"
            form="class-create"
          >
            {isEditMode ? "Edit class" : "Add class"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
