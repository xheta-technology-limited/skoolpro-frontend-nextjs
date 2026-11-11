"use client";

import { useId, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

import { toast } from "sonner";

import { Spinner } from "@/components/animations";
import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import { useListDefaults } from "@/features/departments/api/list-defaults";
import { useProvisionDefaults } from "@/features/departments/api/provision-defaults";
import { useProgressRouter } from "@/features/page-loader";
import { StopCircle } from "iconsax-reactjs";

export interface DefaultDepartmentSet {
  id: string;
  name: string;
  description: string;
  departments: string[];
}

// Preset labels look like "Standard (academic + administrative)"; the
// design wants the name on one line and the parenthetical as the blurb.
function parsePresetLabel(label: string) {
  const [name, ...rest] = label.split("(");
  const description = rest.join("(").replace(/\)\s*$/, "").trim();

  return { name: name.trim(), description };
}

function RadioMark({ selected }: { selected: boolean }) {
  return (
    <StopCircle
      size={24}
      color={selected ? "#000080" : "#454545"}
      variant="Bulk"
      className="mt-0.5 shrink-0"
    />
  )
}

export default function ProvisionDefaultsModal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const isOpen =
    pathname.includes("/departments") &&
    searchParams.get("provision-defaults") === "true";

  const groupName = useId();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    isPending: isDefaultsPending,
    isRefetching,
    error,
    refetch,
  } = useListDefaults({
    enabled: isOpen,
  });

  const { mutate: provision, isPending: isProvisioning } =
    useProvisionDefaults();

  const options: DefaultDepartmentSet[] = Object.entries(
    data?.presets ?? {}
  ).map(([id, preset]) => {
    const { name, description } = parsePresetLabel(preset.label);

    return {
      id,
      name,
      description,
      departments: preset.departments.map((department) => department.name),
    };
  });

  // Derived rather than synced: the first set is selected until the
  // user picks one, and a stale pick (e.g. the options list changed)
  // falls back to the first set instead of pointing at nothing.
  const activeId =
    options.find((option) => option.id === selectedId)?.id ??
    options[0]?.id ??
    null;

  function handleClose() {
    setSelectedId(null);
    router.push("/super-admin/school-onboarding/departments");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) handleClose();
  }

  function handleProvision() {
    if (!activeId) return;

    provision(
      { preset: activeId },
      {
        onSuccess: (result) => {
          toast.success(
            result.created_count > 0
              ? `Provisioned ${result.created_count} departments.`
              : "All default departments already exist."
          );
          handleClose();
        },
      }
    );
  }

  return (
    <FormModal
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="Provision default departments"
    >
      <div className="flex w-full flex-col gap-6">
        {/* Fixed-height scroll area, as in the design: the next card
            peeks out at the bottom to show there's more. */}
        <div className="flex flex-col gap-3">
          {isDefaultsPending ? (
            <div className="flex h-30 items-center justify-center">
              <Spinner size={40} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 px-3 py-6 text-center">
              <p className="text-[13px] text-neutrals-700">
                {error.message || "Couldn't load the default sets."}
              </p>
              <Button
                type="button"
                variant="secondary"
                loading={isRefetching}
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : options.length === 0 ? (
            <p className="px-3 py-6 text-center text-[13px] text-neutrals-700">
              No default sets available.
            </p>
          ) : (
            <div
              role="radiogroup"
              aria-label="Default department sets"
              className="flex flex-col gap-2"
            >
              {options.map((option) => {
                const isSelected = option.id === activeId;
                const count = option.departments.length;

                return (
                  <div
                    key={option.id}
                    className="rounded-2xl bg-primary-bg p-2"
                  >
                  <label
                    key={option.id}
                    className={clsx(
                      "flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4",
                      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
                    )}
                  >
                    <input
                      type="radio"
                      name={groupName}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setSelectedId(option.id)}
                      className="sr-only"
                    />
                    <RadioMark selected={isSelected} />

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-medium leading-[1.2] text-neutrals-900">
                          {option.name}
                        </span>
                        <span className="text-[11px] leading-[1.2] text-neutrals-700">
                          {count} {count === 1 ? "department" : "departments"}
                        </span>
                      </div>

                      <p className="text-[12px] leading-[1.3] text-neutrals-700">
                        {option.description}
                      </p>

                      <ul className="flex flex-wrap gap-1.5">
                        {option.departments.map((department) => (
                          <li
                            key={department}
                            className="rounded-full border border-[#F0EBFB] bg-[#FFFFFF] px-3 py-0.5 text-[11px] leading-[1.4] text-neutrals-700"
                          >
                            {department}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
          >
            <span className="text-[16px] font-normal leading-[1.2] text-primary">
              Cancel
            </span>
          </button>

          <Button
            type="button"
            onClick={handleProvision}
            loading={isProvisioning}
            disabled={isDefaultsPending || !!error || !activeId}
            className="h-14 flex-1 rounded-[28px]"
          >
            Provision
          </Button>
        </div>
      </div>
    </FormModal>
  );
}
