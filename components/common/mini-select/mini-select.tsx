import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Item = {
  label: string;
  value: string;
};
interface Props {
  label: string;
  items: Item[];
}
export default function MiniSelector({ items, label }: Props) {
  return (
    <Select items={items}>
      <SelectTrigger className="max-w-fit bg-white border border-grays-borders">
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
