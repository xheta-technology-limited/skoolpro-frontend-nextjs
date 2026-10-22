"use client";

import { Button } from "@/components/ui/custom-button";
import { Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import {
  SeedFromScaleFormData,
  seedFromScaleSchema,
} from "@/features/comment-bank/schemas/seed-from-scale-schema";
import { useListGradeScales } from "@/features/grade-scales/api/list-grade-scales";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { COMMENT_TYPE_OPTIONS } from "@/features/comment-bank/constants";
import { useSeedFromScale } from "@/features/comment-bank/api/seed-from-scale";
import { toast } from "sonner";

export default function SeedScale() {
  const router = useProgressRouter();
  const params = usePathname();
  const searchParams = useSearchParams();
  const isOpen =
    params.includes("/comment-bank") &&
    searchParams.get("seed-scale") === "true";
  const handleClose = () =>
    router.push("/super-admin/school-onboarding/comment-bank");

  const methods = useForm<SeedFromScaleFormData>({
    defaultValues: {},
    resolver: zodResolver(seedFromScaleSchema),
  });

  const { mutate, isPending } = useSeedFromScale();

  const { data: gradeScales, isPending: isScalesPending } = useListGradeScales({
    refetchOnWindowFocus: false,
  });
  const scaleOptions = createSelectOptions(gradeScales, "id", "name");

  const { data: levels, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levels, "id", "name");
  const onSubmit = (data: SeedFromScaleFormData) => {
    mutate(data, {
      onError: (err) => {
        setFormErrors(methods.setError, err.errors);
      },
      onSuccess: (res) => {
        toast.success(`${res.created} comments created`);
        handleClose();
      },
    });
  };
  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title="Seed from Grade Scale"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="comment-seed"
          className="flex flex-col gap-4 w-full"
        >
          <Select
            name="grade_scale_id"
            label="Select grade scale"
            options={scaleOptions || []}
            isLoading={isScalesPending}
          />
          <Select
            name="type"
            label="Select comment type"
            options={COMMENT_TYPE_OPTIONS}
          />
          <Select
            name="education_level_id"
            label="Select level"
            options={levelOptions || []}
            isLoading={isLevelsPending}
          />
        </form>
      </FormProvider>

      <div className="flex gap-6 *:flex-1">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={isPending} type="submit" form="comment-seed">
          Save Seed Band
        </Button>
      </div>
    </FormModal>
  );
}
