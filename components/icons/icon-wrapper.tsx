import clsx from "clsx";
import React, { HTMLAttributes } from "react";

type props = {
  size: number;
  children: React.ReactNode;
  color?: string;
} & React.HTMLAttributes<HTMLDivElement>;
export default function IconWrapper({ size, children, color }: props) {
  return (
    <div
      className={clsx(
        `w-[${size}px] h-[${size}px] bg-primary-100 rounded-round p-2.5 flex items-center justify-center`,
        color && `bg-[${color}]`
      )}
    >
      {children}
    </div>
  );
}
