import { Text } from "@/components/ui";
import { EducationArm } from "@/features/academic-year";
import { getTextInParentheses } from "@/lib/helpers/get-text-in-parentheses";
import { singledOutLetter } from "@/lib/helpers/single-out-letter";
import { Button } from "@/components/ui/custom-button";
import { useSortable } from "@dnd-kit/react/sortable";

export interface ArmProps {
  arm: EducationArm;
  onEdit: () => void;
  index: number;
  reorderPending: boolean;
}
export function Arm({ arm, onEdit, index, reorderPending }: ArmProps) {
  const { ref, isDragging } = useSortable({
    id: arm.id,
    index,
    type: "arm",
    accept: "arm",
    group: "column",
    disabled: reorderPending,
  });

  return (
    <div
      ref={ref}
      data-dragging={isDragging}
      className="border bg-white border-grays-borders rounded-[8px] flex items-center gap-3 p-4"
    >
      <div className="bg-primary-100 rounded-[8px] p-2">
        <Text weight={"bold"} scale={"caption"}>
          {singledOutLetter(arm.code)?.toUpperCase()}
        </Text>
      </div>
      <div className="flex gap-1 flex-col flex-1">
        <div className="flex gap-3">
          <Text className="text-neutrals-900 font-normal" scale={"caption"}>
            {arm.level.name}
          </Text>

          <Text scale={"caption"} className="text-[0.75rem] text-neutrals-700">
            {`• ${getTextInParentheses(arm.name)}`}
          </Text>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >{`Class teacher: ${"empty for now"}`}</Text>
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >{`Capacity: ${arm.capacity}`}</Text>
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >
            {"Empty for now"}
          </Text>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="text-primary ml-auto"
        onClick={onEdit}
      >
        <Text weight={"standard"} scale={"caption"}>
          Edit
        </Text>
      </Button>
    </div>
  );
}
