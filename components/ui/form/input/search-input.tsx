import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export default function SearchInput({ className, ...props }: Props) {
  return (
    <div className={clsx("relative", className)}>
      <MagnifyingGlassIcon
        size={20}
        className="text-neutrals-700 absolute left-3.5 top-2"
      />
      <input
        className="placeholder:text-neutrals-700 text-[0.8rem] border w-full border-neutrals-100 pl-11 rounded-3xl h-8.75"
        {...props}
      />
    </div>
  );
}
