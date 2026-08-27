"use client";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { SuccessIcon } from "@/components/icons";
import { Text } from "@/components/ui";

type props = {
  isOpen: boolean;
  onClose: () => void;
  subheading?: string;
  heading?: string;
  children?: React.ReactNode;
};
const SuccessModal = ({
  isOpen,
  onClose,
  subheading,
  children,
  heading,
}: props) => {
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
          <DialogPrimitive.Popup
            aria-label={heading || "Success"}
            className="relative my-auto flex w-[80vw] shrink-0 flex-col items-center justify-center gap-4 rounded-ml bg-white px-5 py-14 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:py-29 md:w-155 md:px-12.5"
          >
            <SuccessIcon width={100} height={100} />
            <Text scale={"feature"} weight={"accent"}>
              {heading || "Success"}
            </Text>
            <Text className="text-center" scale={"highlight"} weight={"standard"}>
              {subheading}
            </Text>
            {children}
          </DialogPrimitive.Popup>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default SuccessModal;