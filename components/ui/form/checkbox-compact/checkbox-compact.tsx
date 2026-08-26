"use client";

import { useFormContext, useWatch } from "react-hook-form";
import Text from "../../text/text";
import clsx from "clsx";
import { SquareTickNull } from "@/components/icons";
import { TickSquare } from "iconsax-reactjs";
import { XIcon } from "@phosphor-icons/react";

type Props = {
  name: string;
  label: string;
  id: string;
  subLabel?: string;
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function CompactCheckbox({
  name,
  label,
  id,
  subLabel,
  disabled,
  ...props
}: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const checked = !!useWatch({ control, name });

  return (
    <>
      <label
        htmlFor={id}
        className={clsx(
          "px-4 py-4.75 bg-white border border-grays-borders rounded-[8px] flex justify-between items-center",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
      >
        <div className="flex items-center">
          <span className="text-[0.875rem]">{label}</span>
          <span className="text-[0.75rem]">{subLabel}</span>
        </div>

        <div className="relative inline-flex items-center justify-center">
          <input
            type="checkbox"
            id={id}
            disabled={disabled}
            className={clsx(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              error && "border-red-500"
            )}
            {...register(name)}
            {...props}
          />
          {checked ? (
            <TickSquare
              variant="Bulk"
              size={24}
              aria-hidden="true"
              pointerEvents={"none"}
              className="text-primary"
            />
          ) : (
            <SquareTickNull className="text-[24px]" />
          )}
        </div>
      </label>
      {error && (
        <div className="flex">
          <XIcon size={16} color="#C03744" />{" "}
          <span className="ml-2 text-xs text-error-200">{error}</span>
        </div>
      )}
    </>
  );
}
