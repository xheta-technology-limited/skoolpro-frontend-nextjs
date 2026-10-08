import Header from "../../_components/header";
import GradeScale from "./_components/grade-scales/grade-scale";
import GradingSchemes from "./_components/grading-schemes/grading-schemas";
import PassMark from "./_components/pass-mark/pass-mark";
import PromotionRules from "./_components/promotion-rules/promotion-rules";

export default function Grading() {
  return (
    <>
      <Header label="Grading system" />

      <div className="mb-8 flex w-full flex-col gap-8 rounded-2xl border border-grays-borders bg-white p-4">
        <GradeScale />
        <GradingSchemes />
        <PassMark />
        <PromotionRules />
      </div>
    </>
  );
}
