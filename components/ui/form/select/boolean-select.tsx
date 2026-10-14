import { Controller, useFormContext } from "react-hook-form";
import Select from "./select";
export default function BooleanSelect({
  name,
  label,
  trueLabel = "Yes",
  falseLabel = "No",
}: {
  name: string;
  label: string;
  trueLabel?: string;
  falseLabel?: string;
}) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          name={name}
          label={label}
          value={field.value === undefined ? "" : String(field.value)}
          onChange={(v: string) => field.onChange(v === "true")}
          options={[
            { value: "true", label: trueLabel },
            { value: "false", label: falseLabel },
          ]}
        />
      )}
    />
  );
}
