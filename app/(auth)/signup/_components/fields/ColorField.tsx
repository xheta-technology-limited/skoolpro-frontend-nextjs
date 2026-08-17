"use client";

import { useEffect } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Input } from "@/components/ui/form";

interface ColorFieldProps {
  name: string;
  label: string;
}

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const ColorField = ({ name, label }: ColorFieldProps) => {
  const { control, setValue } = useFormContext();
  const textValue = useWatch({ control, name });

  useEffect(() => {
    if (typeof textValue === "string" && HEX_COLOR_REGEX.test(textValue)) {
      setValue(`${name}Swatch`, textValue, { shouldValidate: true, shouldDirty: true });
    }
  }, [textValue, name, setValue]);

  return (
    <div className="flex w-full min-w-0 items-center gap-4">
      <div className="min-w-0 flex-1">
        <Input name={name} label={label} />
      </div>

      <Controller
        name={`${name}Swatch`}
        control={control}
        render={({ field }) => (
          <div className="flex h-12.75 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F5F5FF] p-2">
            <input
              type="color"
              value={field.value || "#FFFFFF"}
              onChange={(e) => {
                field.onChange(e.target.value);
                setValue(name, e.target.value, { shouldValidate: true, shouldDirty: true });
              }}
              aria-label={`${label} swatch`}
              className="h-8.75 w-16 cursor-pointer appearance-none rounded-lg border-0 bg-white p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
            />
          </div>
        )}
      />
    </div>
  );
};

export default ColorField;