import { EducationArm } from "@/features/academic-year";
import { useDroppable } from "@dnd-kit/react";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Arm } from "./arm";
import { CollisionPriority } from "@dnd-kit/abstract";

interface ColumnProps {
  armsData: EducationArm[] | undefined;
  router: {
    push: (href: string, options?: NavigateOptions | undefined) => void;
    replace: (
      href: string,
      options?: Parameters<(href: string, options?: NavigateOptions) => void>[1]
    ) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
}
export function DroppableColumn({ armsData, router }: ColumnProps) {
  const { ref } = useDroppable({
    id: "arms-droppable",
    type: "column",
    accept: "arm",
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <div className="flex flex-col gap-1" ref={ref}>
      {armsData?.map((arm, index) => (
        <Arm
          key={arm.id}
          index={index}
          arm={arm}
          onEdit={() =>
            router.push(
              `/super-admin/school-onboarding/academic-year?open=true&step=3&editId=${arm.id}`
            )
          }
        />
      ))}
    </div>
  );
}
