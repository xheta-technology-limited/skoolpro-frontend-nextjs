"use client";
import { useFormContext } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { EyeSlash, Eye, SearchNormal } from "iconsax-reactjs";
import clsx from "clsx";
import { useState } from "react";
import { Spinner } from "@/components/animations";

type InputProps = {
  name: string;
  search?: boolean;
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
  search,
  ...props
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const [isPasswordShown, setPasswordShown] = useState(false);
  const isPasswordType = props.type === "password" && !isPasswordShown;
  const passwordType = isPasswordType ? "password" : "text";

  return (
    <div className="relative">
      <input
        {...register(name)}
        {...props}
        id={`floating_input_${name}`}
        type={passwordType}
        className={clsx(
          (icon || props.type === "password") && "pr-13.75",
          search && "pl-13.75",
          "w-full h-[3.18rem] mb-2 peer rounded-ml bg-[#F5F5FF] px-ml text-[0.875rem] md:text-[1rem] focus:bg-transparent focus:outline-primary-500 focus:outline-1 not-placeholder-shown:bg-transparent disabled:bg-[#F6F3FDCC]",
          error && "bg-[#FBD6D45C]"
        )}
        placeholder=" "
      />

      <label
        htmlFor={`floating_input_${name}`}
        className={clsx(
          "absolute peer-placeholder-shown:top-4 text-neutral-400 transition-all peer-focus:top-0 peer-focus:text-[0.75rem] peer-not-placeholder-shown:text-[0.75rem] peer-disabled:text-neutrals-100",
          search ? "left-14" : "left-ml"
        )}
      >
        {label}
      </label>

      {search && (
        <div className="absolute left-5 top-[0.843rem] peer-disabled:text-neutrals-100">
          <SearchNormal variant="Bulk" className="text-neutrals-400 w-6 h-6" />
        </div>
      )}

      {icon && (
        <div className="absolute right-5 top-[0.843rem] peer-disabled:text-neutrals-100">
          {icon}
        </div>
      )}

      {props.type === "password" && (
        <button
          type="button"
          onClick={() => setPasswordShown((prev) => !prev)}
          className="absolute cursor-pointer right-5 top-[0.843rem] border-0 bg-red peer-disabled:text-neutrals-100"
        >
          {isPasswordShown ? (
            <EyeSlash variant="Bulk" size={24} className="text-neutrals-400" />
          ) : (
            <Eye variant="Bulk" size={24} className="text-neutrals-400" />
          )}
        </button>
      )}

      {error && (
        <div className="flex">
          <XIcon size={16} color="#C03744" />{" "}
          <span className="ml-2 text-xs text-[#C03744]">{error}</span>
        </div>
      )}
      {errors.root?.serverError.type === 401 && (
        <div className="flex">
          <XIcon size={16} color="#C03744" />{" "}
          <span className="ml-2 text-xs text-[#C03744]">
            Invalid credentials
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex gap-1">
          <Spinner size={16} color={"#9f9c9c"} />
          <span className="text-xs text-neutrals-400">Loading</span>
        </div>
      )}
    </div>
  );
};

export default Input;
