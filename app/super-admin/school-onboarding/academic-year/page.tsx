import { Suspense } from "react";
import AcademicYears from "./_components/years";

export default function AcademicYearPage() {
  return (
    <div className="p-6">
      <Suspense fallback={null}>
        <AcademicYears />
      </Suspense>
    </div>
  );
}
