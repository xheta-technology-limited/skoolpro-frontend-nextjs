import { Text } from "@/components/ui";
import clsx from "clsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { number } from "zod";

const texts = ["Prepared", "Review & Adjust", "Commit"];
interface SProps {
  stage: number;
}
export default function CurrentStage({ stage }: SProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      {texts.map((text, index) => (
        <Stage
          key={index}
          index={index}
          label={text}
          step={index + 1}
          status={
            stage === 0
              ? "pending"
              : stage > index + 1
              ? "completed"
              : stage === index + 1
              ? "current"
              : "pending"
          }
        />
      ))}
    </div>
  );
}

interface Props {
  step: number;
  status: "current" | "completed" | "pending";
  label: string;
  index: number;
}
function Stage({ status, step, index, label }: Props) {
  return (
    <div className="gap-2 items-center flex">
      {status === "completed" ? (
        <DotLottieReact
          src="/animations/success-check.lottie"
          className="w-11 h-11"
          loop
          autoplay
          segment={[19, 110]}
        />
      ) : (
        <Text
          className={clsx(
            status === "current" && "text-success-300 bg-[#EDFDFA]",
            status === "pending" && "text-neutrals-700 bg-[#F4F6F5]",
            "py-2 px-3.25 rounded-ml"
          )}
          scale={"content"}
          weight={"standard"}
        >
          {step}
        </Text>
      )}
      <Text scale={"content"} className="text-neutrals-700">
        {label}
      </Text>
    </div>
  );
}
