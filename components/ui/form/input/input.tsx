type InputProps = {
  isError?: boolean;
  isLoading?: boolean;
  isWarning?: boolean;
  placeholder?: string;
} & React.ButtonHTMLAttributes<HTMLInputElement>;

const Input = ({
  isError,
  isLoading,
  isWarning,
  placeholder,
  children,
}: InputProps) => {
  return (
    <>
      <div className="relative">
        <input
          className="w-75 h-[3.18rem] peer rounded-ml bg-[#F5F5FF] px-ml text-[0.875rem] md:text-[1rem] focus:pt-2 focus:bg-transparent focus:border-primary-500"
          placeholder=" "
        />
        <label className="absolute left-ml transition-all peer-focus:top-1 top-4 peer-focus:text-[0.75rem] text-neutral-400">
          {placeholder}
        </label>
        <img className="absolute right-5 top-[0.843rem]" />
      </div>
    </>
  );
};

export default Input;
