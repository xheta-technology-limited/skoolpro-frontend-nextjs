import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown } from "iconsax-reactjs";

type Item = {
  label: string;
  value: string;
};
interface Props {
  label: string;
  items: Item[];
  defaultValue?: string;
}
export default function MiniSelector({ items, label }: Props) {
  return (
    <Select items={items}>
      <SelectTrigger
        icon={<ArrowDown variant="Bulk" size={12} />}
        className="max-w-fit bg-white border border-grays-borders"
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
