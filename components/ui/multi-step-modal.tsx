"use client";

import { ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { CloseSquare } from "iconsax-reactjs";

interface MultiStepFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: ReactNode;
  children: ReactNode;
  maxWidth?: string;
  icon?: ReactNode;

  currentStep: number;
  totalSteps: number;
}

const MultiStepFormModal = ({
  open,
  onOpenChange,
  title,
  children,
  maxWidth = "max-w-175.25",
  icon,
  currentStep,
  totalSteps,
}: MultiStepFormModalProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
          <DialogPrimitive.Popup
            className={`relative my-auto grid w-full ${maxWidth} shrink-0 gap-8 rounded-2xl bg-white p-4 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:p-6`}
          >
            <DialogPrimitive.Close className="absolute right-2 top-2 sm:-right-5 sm:-top-5">
              <CloseSquare size={24} variant="Bulk" color="#433E3F" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <div className="flex w-full items-center justify-between text-left">
              <DialogPrimitive.Title className="text-[24px] font-semibold leading-[1.2] text-neutrals-900">
                {title}
              </DialogPrimitive.Title>

              <div className="flex items-center gap-4 pr-2 sm:pr-0">
                {icon && <div className="shrink-0">{icon}</div>}

                <div
                  className="relative flex size-15 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(
                        #E5E5E5 0% ${100 - progress}%,
                        #010081 ${100 - progress}% 100%
                    )`,
                  }}
                >
                  <div className="flex size-13 items-center justify-center rounded-full bg-white">
                    <span className="font-[Poppins] text-[18px] font-semibold leading-[120%] text-neutrals-900">
                      {currentStep}/{totalSteps}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {children}
          </DialogPrimitive.Popup>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default MultiStepFormModal;