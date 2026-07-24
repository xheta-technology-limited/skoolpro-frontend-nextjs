import { IconWrapper } from "@/components/icons";
import clsx from "clsx";
import { TickCircle, Mobile } from "iconsax-reactjs";

interface props {
  title: string;
  isActive: boolean;
}

const MfaButton = ({ title, isActive }: props) => {
  return (
    <div
      className={clsx(
        "transition-all border flex gap-4 p-8 border-primary rounded-br-[200px] text-primary rounded-tr-[200px] rounded-tl-8 rounded-bl-4 bg-white hover:bg-primary-200 hover:text-white",
        isActive && "bg-primary-900 border-primary-500"
      )}
    >
      <IconWrapper size={44}>
        <Mobile size={24} color="#010067" variant="Bulk" />
      </IconWrapper>
      <span
        className={clsx(
          "font-semibold text-[1.125rem]",
          isActive && "text-white"
        )}
      >
        {title}
      </span>
      <TickCircle
        size={32}
        variant="Bulk"
        color="#FAFAFA"
        className="top-4.75 right-7.75 absolute"
      />
    </div>
  );
};

export default MfaButton;
