"use client";
import clsx from "clsx";
import { OTPInput, SlotProps, REGEXP_ONLY_DIGITS } from "input-otp";

type props = {
  length: number;
  name: string;
  value?: string;
  onChange?: (e: string) => void;
  className?: string;
};
export default function OTP({
  length,
  name,
  className,
  value,
  onChange,
}: props) {
  return (
    <OTPInput
      name={name}
      onChange={onChange}
      value={value}
      containerClassName={className}
      pattern={REGEXP_ONLY_DIGITS}
      maxLength={length}
      render={({ slots }) => (
        <>
          <div className="flex">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={clsx(
        "relative w-12 h-12 text-[2rem]",
        "flex items-center justify-center",
        "transition-all",
        "bg-[#F5F5FF] rounded-[12px]",
        "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
        "mx-3 first:mx-0 last:mx-0 first:mr-3 last:ml-3",
        "outline-0 outline-primary-500/20",
        { "outline-2 outline-primary-500/20": props.isActive }
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {props.char ?? props.placeholderChar}
      </div>
    </div>
  );
}
