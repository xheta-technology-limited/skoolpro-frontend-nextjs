import { DocumentText1, DocumentDownload, Trash } from "iconsax-reactjs";

interface LicenseFileRowProps {
  name: string;
  sizeLabel: string;
  url: string;
  mode: "view" | "edit";
  onRemove?: () => void;
}

const LicenseFileRow = ({
  name,
  sizeLabel,
  url,
  mode,
  onRemove,
}: LicenseFileRowProps) => (
  <div className="flex h-18 w-62.5 items-center gap-2.5 rounded-2xl border border-[#E8E9EB] p-4">
    <DocumentText1 size={20} variant="Bulk" color="#E4626F" />
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-[14px] font-normal leading-[1.2] text-neutrals-900">
        {name}
      </span>
      <span className="text-[12px] font-normal leading-[1.2] text-neutrals-500">
        {sizeLabel}
      </span>
    </div>
    {mode === "edit" ? (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
      >
        <Trash size={20} variant="Bulk" color="#433E3F" />
      </button>
    ) : (
      <a href={url} aria-label={`Download ${name}`}>
        <DocumentDownload size={20} variant="Bulk" color="#5A5555" />
      </a>
    )}
  </div>
);

export default LicenseFileRow;