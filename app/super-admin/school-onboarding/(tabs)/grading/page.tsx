import Header from "../../_components/header";
import GradeScale from "./_components/grade-scales/grade-scale";

export default function Grading() {
  return (
    <>
      <Header label="Grading system" />

      <div className="mb-8 flex w-full flex-col gap-8 rounded-2xl border border-grays-borders bg-white p-4">
        <GradeScale />
      </div>
    </>
  );
}
