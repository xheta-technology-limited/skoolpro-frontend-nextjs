"use client";

import { ReactNode } from "react";
import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import Image from "next/image";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const DeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  description,
  title = "Are you sure",
  confirmText = "Yes, Delete",
  cancelText = "No, Abort",
  loading = false,
}: DeleteModalProps) => {
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={""}>
      <div className="flex flex-col gap-4 items-center">
        <div className="h-25 w-25 rounded-full bg-grays-borders flex items-center justify-center">
          <Image
            alt="trash"
            height={48}
            width={48}
            src={"/images/delete.png"}
          />
        </div>

        <Text scale={"feature"} weight={"accent"} className="text-neutrals-900">
          {title}
        </Text>
        <Text
          scale="highlight"
          weight={"standard"}
          className="text-neutrals-900 text-center"
        >
          {description}
        </Text>
      </div>

      <div className="flex items-center justify-between gap-6 *:flex-1 mx-6.25">
        <Button
          variant="secondary"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button variant="primary" loading={loading} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </FormModal>
  );
};

export default DeleteModal;
