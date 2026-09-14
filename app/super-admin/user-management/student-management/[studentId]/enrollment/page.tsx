"use client";

import { Button } from "@/components/ui/custom-button";
import DetailCard from "@/components/common/detail-card/DetailCard";
import RecordTableSection, {
  type RecordTableRow,
} from "@/components/common/record-table-section/RecordTableSection";

function noop() {}

export default function StudentEnrollmentPage() {
  // TODO: replace with real fetched values once the enrollment GET is wired.
  const academicYearLabel = "2026/2027";

  const placementFields = [
    { label: "Class/Section", value: "" },
    { label: "Roll number", value: "" },
    { label: "Enrollment status", value: "" },
    { label: "Enrolled on", value: "" },
  ];

  const subjectRows: RecordTableRow[] = [];
  const historyRows: RecordTableRow[] = [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium uppercase tracking-wide text-neutrals-500">
          Current placement ({academicYearLabel})
        </span>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={noop}
          >
            Transfer
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={noop}
            className="border-error-200! text-error-200! hover:bg-error-200/5"
          >
            Withdraw
          </Button>
        </div>
      </div>

      <DetailCard fields={placementFields} />

      <RecordTableSection
        title="Subjects offered"
        columns={[
          { key: "subject", label: "Subject" },
          { key: "source", label: "Source" },
          { key: "passmark", label: "Passmark" },
        ]}
        rows={subjectRows}
        onAdd={noop}
        addLabel="Add optional subject"
        emptyLabel="No subjects added yet."
      />

      <RecordTableSection
        title="Enrollment history"
        columns={[
          { key: "academicYear", label: "Academic year" },
          { key: "classSection", label: "Class/Section" },
          { key: "status", label: "Status" },
        ]}
        rows={historyRows}
        emptyLabel="No enrollment history yet."
      />
    </div>
  );
}