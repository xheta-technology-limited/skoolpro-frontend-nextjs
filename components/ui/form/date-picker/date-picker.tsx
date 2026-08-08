"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Calendar } from "../../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Input } from "../input";
import { Calendar as CalendarIcon } from "iconsax-reactjs";
import { useFormContext, Controller } from "react-hook-form";
import { formatDateObjectToString } from "@/lib/utils/format-date";

type Props = {
  name: string;
  label?: string;
  isWarning?: boolean;
};

export default function DatePicker({ name, label, isWarning }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          readOnly
          name={name}
          label={label}
          isWarning={isWarning}
          onClick={() => setOpen(true)}
          value={
            field.value ? formatDateObjectToString(new Date(field.value)) : ""
          }
          icon={
            <CalendarContents
              open={open}
              setOpen={setOpen}
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => {
                if (!date) return;
                field.onChange(date.toISOString());
              }}
            />
          }
        />
      )}
    />
  );
}

type CalendarProps = {
  onSelect: (e: Date | undefined) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selected?: Date;
};
const CalendarContents = ({
  onSelect,
  open,
  setOpen,
  selected,
}: CalendarProps) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button>
            <CalendarIcon size={24} variant="Bulk" />
          </button>
        }
      />
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="end"
        alignOffset={-8}
        sideOffset={10}
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          captionLayout="dropdown"
          onSelect={(date) => {
            onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
