"use client";

import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { ArrowLeft } from "iconsax-reactjs";
import { useProgressRouter } from "@/features/page-loader";
import { DocumentDownload, DocumentUpload, AddSquare } from "iconsax-reactjs";

interface Props {
  role: string;
  onExportClick: () => void;
  onImportClick: () => void;
  onAddClick: () => void;
}
export default function Header({
  onExportClick,
  onImportClick,
  onAddClick,
  role,
}: Props) {
  const router = useProgressRouter();
  return (
    <div className="flex justify-between items-center flex-wrap md:min-w-xl lg:min-w-2xl mb-6 gap-4">
      <div
        onClick={() => router.back()}
        className="flex gap-3 cursor-pointer items-center"
      >
        <ArrowLeft variant="Bulk" size={24} />
        <Text weight={"accent"} scale={"feature"} className="text-neutrals-900">
          User management
        </Text>
      </div>

      <div className="flex gap-4 items-center">
        <Button
          leftIcon={
            <DocumentUpload size={20} variant="Bulk" className="text-primary" />
          }
          size="md"
          variant="tertiary"
          className="bg-white"
          onClick={onExportClick}
        >
          Export
        </Button>
        <Button
          leftIcon={
            <DocumentDownload
              size={20}
              variant="Bulk"
              className="text-primary"
            />
          }
          size="md"
          variant="secondary"
          onClick={onImportClick}
        >{`Import ${role}`}</Button>
        <Button
          leftIcon={
            <AddSquare size={20} variant="Bulk" className="text-base-white" />
          }
          size="md"
          variant="primary"
          onClick={onAddClick}
        >{`Add ${role}`}</Button>
      </div>
    </div>
  );
}
