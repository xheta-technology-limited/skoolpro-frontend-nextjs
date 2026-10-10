import { StatusBadge } from "@/components/common";

interface Parent {
  id: string;
  name: string;
  email: string;
  occupation: string;
  childrenCount: string;
  phone: string;
  hasLogin: boolean;
}

interface ParentRowProps {
  parent: Parent;
  gridTemplate: string;
  onClick?: (parent: Parent) => void;
}

export default function ParentRow({
  parent,
  gridTemplate,
  onClick,
}: ParentRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(parent)}
      className={`group grid ${gridTemplate} min-h-12.25 w-full items-center border-b border-primary-100 px-4 py-3 text-left last:border-b-0 hover:bg-primary-bg sm:px-5 lg:px-6`}
    >
      <span className="truncate text-[13px] text-neutrals-900">
        {parent.name}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {parent.email}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {parent.occupation}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {parent.childrenCount}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {parent.phone}
      </span>
      <div className="justify-self-start">
        <StatusBadge
          data={parent.hasLogin ? "Linked" : "Not linked"}
          variant={parent.hasLogin ? "green" : "orange"}
        />
      </div>
    </button>
  );
}

export type { Parent };