"use client";

import { ReactNode } from "react";
import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
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
  confirmText = "Yes, Delete",
  cancelText = "No, Abort",
  loading = false,
}: DeleteModalProps) => {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      maxWidth="max-w-112"
    >
      <Text scale="content" className="text-neutrals-700">
        {description}
      </Text>

      <div className="flex items-center justify-between gap-4">
        <Button onClick={() => onOpenChange(false)} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant="secondary"
          loading={loading}
          onClick={onConfirm}
          className="border-error-200! text-error-200!"
        >
          {confirmText}
        </Button>
      </div>
    </FormModal>
  );
};

export default DeleteModal;
