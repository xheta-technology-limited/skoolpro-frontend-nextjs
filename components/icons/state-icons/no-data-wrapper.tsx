import clsx from "clsx";

type Variant = "messages" | "signal" | "search" | "page" | "notification";
type IconProps = {
  title?: string;
  subTitle?: string;
  variant?: Variant;
} & React.ComponentProps<"div">;
const NoDataWrapper = ({
  title,
  subTitle,
  variant = "messages",
  className,
  ...divProps
}: IconProps) => {
  const iconSource =
    variant === "messages"
      ? "/icons/empty-states/no_messages.svg"
      : variant === "signal"
      ? "/icons/empty-states/no_connection.svg"
      : variant === "notification"
      ? "/icons/empty-states/no_notifications.svg"
      : variant === "page"
      ? "/icons/empty-states/page_not_found.svg"
      : variant === "search"
      ? "/icons/empty-states/search_not_found.svg"
      : "";
  return (
    <div
      {...divProps}
      className={clsx(
        "relative w-full h-71.75 md:h-143.75 md:w-97.5 flex flex-col items-center gap-7.5 py-12.5 px-9 overflow-hidden bg-[#FCFDFF] rounded-[35px] shadow-[21px_27px_50px_-8px_#D4B2B22B]",
        className
      )}
    >
      <img src={iconSource} className="mt-2.5 max-w-61.25 max-h-59"></img>

      {title && (
        <div className={clsx("w-full text-center mb-5")}>
          <p className="m-0 text-[1.2rem] md:text-[1.75rem] font-bold leading-[1.2] wrap-break-word text-black">
            {title}
          </p>
          <p className="m-0 text-[1.125rem] font-medium leading-[1.2] wrap-break-word text-[#9E9E9E]">
            {subTitle}
          </p>
        </div>
      )}

      <img
        className="w-50.5 h-20.75"
        src={"/icons/empty-states/empty_shadow.svg"}
      ></img>
    </div>
  );
};

export default NoDataWrapper;
