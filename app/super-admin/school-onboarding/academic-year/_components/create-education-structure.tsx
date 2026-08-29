"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { CompactCheckbox } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";

import {
  EducationStructureFormData,
  educationStructureSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import clsx from "clsx";
import { useListPresets } from "@/features/academic-year/api/list-presets";
import { Spinner } from "@/components/animations";
import { useEffect, useState } from "react";
import { useApplyEducationPreset } from "@/features/academic-year/api/apply-preset";

export default function CreateEducationStructure() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<EducationStructureFormData>({
    defaultValues: {},
    resolver: zodResolver(educationStructureSchema),
  });
  const [activeLadder, setActiveLadder] = useState("");

  const { data, isFetching, isLoading, isError, refetch } = useListPresets();
  const { mutate, isPending } = useApplyEducationPreset(activeLadder);

  const onSubmit = (data: EducationStructureFormData) => {
    mutate(data, {
      onSuccess: () =>
        router.push(
          "/super-admin/school-onboarding/academic-year?open=true&step=3"
        ),
    });
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "2";

  const selectedLadder = data?.find((d) => d.key === activeLadder);

  useEffect(() => {
    if (data && data.length !== 0) {
      setActiveLadder(data[0].key);
    }
  }, [data]);

  return (
    <>
      <FormModal
        title="Create Education Structure"
        open={isOpen}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size={48} />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center">
            <Button loading={isFetching} size="lg" onClick={() => refetch}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-full">
            <div className="flex gap-4 *:flex-1">
              {data?.map((ladder) => (
                <LadderSelect
                  key={ladder.key}
                  name={ladder.label.split("(")[0]}
                  info={ladder.label}
                  isActive={activeLadder === ladder.key}
                  onClick={() => setActiveLadder(ladder.key)}
                />
              ))}
            </div>
            <Text className="text-neutrals-700" scale={"content"}>
              Stages School Offer
            </Text>
            <FormProvider {...methods}>
              <form
                className="flex flex-col sm:h-auto gap-6 rounded-ml p-2 w-full bg-primary-bg"
                onSubmit={methods.handleSubmit(onSubmit)}
                id="create-education-structure-form"
              >
                {selectedLadder?.stages.map((stage) => (
                  <CompactCheckbox
                    key={stage.code}
                    label={stage.name}
                    name="include_stages"
                    id={stage.code}
                    value={stage.name}
                  />
                ))}
              </form>
            </FormProvider>

            <Text className="text-neutrals-700" scale={"content"}>
              Resulting ladder
            </Text>

            {selectedLadder &&
              selectedLadder.stages.map((ladder, index) => (
                <Ladder
                  key={`${ladder.school_type_slug}-${ladder.name}`}
                  name={ladder.name}
                  stage={index + 1} //backend didn't provide this so I wing it
                  items={ladder.levels}
                />
              ))}

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
                type="submit"
                loading={isPending}
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
                form="create-education-structure-form"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </FormModal>
    </>
  );
}

interface LadderSelectProps {
  name: string;
  info: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}
function LadderSelect({
  name,
  info,
  isActive = false,
  className,
  onClick,
}: LadderSelectProps) {
  const parseString = (value: string): string[] => {
    const match = value.match(/\(([^)]*)\)/);

    if (!match) return [];

    return match[1].split("/");
  };
  const parsedInfo = parseString(info);

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex flex-col gap-2 rounded-ml bg-base-white border p-4  hover:cursor-pointer",
        isActive && "border-primary",
        className
      )}
    >
      <Text
        className={clsx(isActive ? "text-primary" : "text-neutrals-800")}
        weight={"standard"}
        scale={"content"}
      >
        {name}
      </Text>
      <div className="flex items-center gap-2 max-w-full flex-wrap">
        {parsedInfo.map((inf) => (
          <Text
            className="text-[0.75rem] tracking-tight leading-none"
            weight={"standard"}
            scale={"caption"}
            key={inf}
          >
            {inf}
          </Text>
        ))}
      </div>
    </div>
  );
}

interface LadderItem {
  name: string;
  typical_entry_age: number;
}
interface LadderProps {
  name: string;
  stage: number;
  items: LadderItem[];
  className?: string;
}
function Ladder({ name, stage, items, className }: LadderProps) {
  return (
    <div
      className={clsx(
        "rounded-ml pb-4 flex flex-col gap-4 border border-grays-borders",
        className
      )}
    >
      <div className="flex w-full justify-between bg-primary-bg border border-grays-borders px-4 py-2 rounded-tl-ml rounded-tr-ml">
        <Text
          className="text-neutrals-text-body-light-1"
          weight={"accent"}
          scale={"content"}
        >
          {name}
        </Text>
        <Text
          className="text-neutrals-text-body-light-1"
          weight={"standard"}
          scale={"caption"}
        >
          Stage {stage}
        </Text>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="border border-grays-borders rounded-[8px] flex justify-between p-4"
          >
            <Text
              className="text-neutrals-900"
              weight={"standard"}
              scale={"caption"}
            >
              {item.name}
            </Text>
            <Text
              className="text-[0.75rem] text-neutrals-700"
              weight={"standard"}
              scale={"caption"}
            >{`Age ${item.typical_entry_age}`}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
