"use client";
import { useFormContext } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type InputProps = {
  name: string;
  label?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
  isWarning?: boolean;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  name,
  label,
  isSuccess,
  isLoading,
  isWarning,
  icon,
  ...props
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div style={{ backgroundColor: error && "#FBD6D45C" }} className="relative">
      <input
        {...register(name)}
        {...props}
        style={{ paddingRight: icon ? "55px" : undefined }}
        className="w-75 h-[3.18rem] mb-2 peer rounded-ml bg-[#F5F5FF] px-ml text-[0.875rem] md:text-[1rem] focus:pt-2 focus:bg-transparent focus:border-primary-500"
        placeholder=" "
      />

      <label className="absolute left-ml top-4 text-neutral-400 transition-all peer-focus:top-1 peer-focus:text-[0.75rem]">
        {label}
      </label>

      {icon && <div className="absolute right-5 top-[0.843rem]">{icon}</div>}

      {error && (
        <>
          <XIcon size={16} color="#C03744" />{" "}
          <span className="ml-2 text-xs text-[#C03744]">{error}</span>
        </>
      )}

      {isLoading && (
        <div className="flex gap-1">
          <DotLottieReact
            src="/animations/ios-style-loading-spinner.lottie"
            loop
            autoplay
            className="w-4 h-4"
          />
          <span className="text-xs text-neutrals-400">Loading</span>
        </div>
      )}
    </div>
  );
};

export default Input;
