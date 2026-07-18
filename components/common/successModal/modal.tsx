"use client";
import { SuccessIcon } from "@/components/icons";
import { Text } from "@/components/ui";
import { useEffect, useState } from "react";

type props = {
  isOpen: boolean;
  onClose: () => void;
  subheading?: string;
  children?: React.ReactNode;
};
const SuccessModal = ({ isOpen, onClose, subheading, children }: props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (isOpen) {
    return (
      <>
        <div
          onClick={onClose}
          className="absolute px-7 inset-0 bg-neutrals-600 opacity-50 z-40"
        ></div>
        <div className="bg-base-white w-[80vw] py-14 sm:py-29 px-5 z-50 md:w-155 rounded-ml flex flex-col gap-4 items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <SuccessIcon width={100} height={100} />
          <Text scale={"feature"} weight={"accent"}>
            Success
          </Text>
          <Text className="text-center" scale={"highlight"} weight={"standard"}>
            {subheading}
          </Text>
          {children}
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default SuccessModal;
