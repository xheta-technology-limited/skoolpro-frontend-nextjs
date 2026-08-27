import FilterIcon from "@/components/icons/filter-icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown3 } from "iconsax-reactjs";
import React from "react";

type Item = {
  value: string | null;
  label: string;
};
interface Props extends React.ComponentProps<typeof Select> {
  label?: string;
  items: Item[];
}
export default function MiniSelector({ items, label, ...props }: Props) {
  return (
    <Select items={items} {...props}>
      <SelectTrigger
        icon={<FilterIcon fontSize={12} />}
        className="max-w-fit bg-white border border-grays-borders rounded-[12px]"
      >
        <SelectValue
          className={"text-[0.75rem] md:text-[0.875rem] text-neutrals-700"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
