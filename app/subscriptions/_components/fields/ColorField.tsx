import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import { SchoolProfileFormValues } from "../SchoolProfileStep";
import TextField from "./TextField";

interface ColorFieldProps {
  placeholder: string;
  textFieldName: keyof SchoolProfileFormValues;
  textRegister: UseFormRegisterReturn;
  colorRegister: UseFormRegisterReturn;
  value: string;
  setValue: UseFormSetValue<SchoolProfileFormValues>;
}

const ColorField = ({
  placeholder,
  textFieldName,
  textRegister,
  colorRegister,
  value,
  setValue,
}: ColorFieldProps) => {
  return (
    <div className="flex flex-1 items-center gap-4">
        <TextField placeholder={placeholder} register={textRegister} value={value} />

      <div className="flex h-12.75 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F5F5FF] p-2">
        <input
          type="color"
          defaultValue="#FFFFFF"
          {...colorRegister}
          onChange={(e) => setValue(textFieldName, e.target.value)}
          className="h-8.75 w-16 cursor-pointer appearance-none rounded-lg border-0 bg-white p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
        />
      </div>
    </div>
  );
};

export default ColorField;