import { CloseSquare } from "iconsax-reactjs";
import { Text } from "@/components/ui";
interface ItemProps {
  label: string;
  onButtonClick: () => void;
}
const Item = ({ label, onButtonClick }: ItemProps) => {
  return (
    <div className="border border-grays-borders bg-white rounded-[8px] p-2 flex justify-between items-center">
      <Text mobile scale={"content"} className="text-neutrals-900">
        {label}
      </Text>
      <button aria-label="remove-subject" onClick={onButtonClick}>
        <CloseSquare variant="Bulk" size={16} className="text-primary" />
      </button>
    </div>
  );
};
export default Item;
