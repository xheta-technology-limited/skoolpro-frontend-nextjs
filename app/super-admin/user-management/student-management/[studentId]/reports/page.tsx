"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowSquareRight, DocumentText1 } from "iconsax-reactjs";

import { Button } from "@/components/ui/custom-button";
import FlatTable, {
  type FlatTableRow,
} from "../../_components/FlatTable";


interface ResultOption {
  id: string;
  label: string;
  detailTitle: string;
}

const RESULT_OPTIONS: ResultOption[] = [
  { id: "js1", label: "JS 1 Result", detailTitle: "JS 1 First term result" },
  { id: "js2", label: "JS 2 Result", detailTitle: "JS 2 First term result" },
  { id: "js3", label: "JS 3 Result", detailTitle: "JS 3 First term result" },
  { id: "ss1", label: "SS 1 Result", detailTitle: "SS 1 First term result" },
  { id: "ss2", label: "SS 2 Result", detailTitle: "SS 2 First term result" },
  { id: "ss3", label: "SS 3 Result", detailTitle: "SS 3 First term result" },
];

// MOCK: placeholder score rows matching the screenshot's shape, until
// a real results endpoint exists.
const RESULT_COLUMNS = [
  { key: "subject", label: "Subject" },
  { key: "test1", label: "Test 1" },
  { key: "test2", label: "Test 2" },
  { key: "test3", label: "Test 3" },
  { key: "exam", label: "Exam" },
  { key: "total", label: "Total", valueClassName: "font-semibold text-[#0BA968]" },
];

const MOCK_SCORE_ROWS: FlatTableRow[] = Array.from(
  { length: 9 },
  (_, index) => ({
    id: `score-${index}`,
    cells: {
      subject: "English",
      test1: "10",
      test2: "10",
      test3: "10",
      exam: "70",
      total: "100",
    },
  })
);

function noop() {}

type View = "list" | "detail" | "certificate";

export default function StudentReportsPage() {
  const [view, setView] = useState<View>("list");
  const [selectedResultId, setSelectedResultId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const selectedResult = RESULT_OPTIONS.find(
    (option) => option.id === selectedResultId
  );

  function handleSelectResult(resultId: string) {
    setSelectedResultId(resultId);
    setView("detail");
    setIsEditing(false);
  }

  function handleBack() {
    if (view === "certificate") {
      setView("detail");
      return;
    }
    setView("list");
    setSelectedResultId(null);
    setIsEditing(false);
  }

  if ((view === "detail" || view === "certificate") && selectedResult) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-3"
          >
            <ArrowLeft size={24} variant="Bulk" color="currentColor" />
            <span className="text-[16px] font-medium text-neutrals-900">
              {selectedResult.detailTitle}
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setView("certificate")}
              className="flex items-center gap-2 text-[14px] font-medium text-primary"
            >
              Generate certificate
              <DocumentText1 size={16} variant="Bulk" color="currentColor" />
            </button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Save changes" : "Edit"}
            </Button>
          </div>
        </div>

        {view === "certificate" ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Image
              src="/certificategen.png"
              alt="Certificate preview"
              width={150}
              height={150}
              className="h-auto w-37.5"
            />
            <span className="text-[14px] text-neutrals-700">
              Certificate preview
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <FlatTable columns={RESULT_COLUMNS} rows={MOCK_SCORE_ROWS} />

            {isEditing && (
              <button
                type="button"
                onClick={noop}
                className="mt-2 flex w-fit items-center gap-2 text-[14px] text-neutrals-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutrals-100 text-[16px] leading-none">
                  +
                </span>
                Add new field
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
        STUDENT RESULT
      </span>

      <div className="flex flex-col gap-3">
        {RESULT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelectResult(option.id)}
            className="flex min-h-16.25 w-full items-center justify-between gap-2 rounded-2xl border border-primary-100 bg-#FFFFFF p-4 text-left transition-colors hover:bg-primary-bg"
          >
            <span className="font-poppins text-base font-semibold leading-[120%] tracking-normal text-neutrals-700">
              {option.label}
            </span>
            <ArrowSquareRight size={24} variant="Bulk" color="currentColor" />
          </button>
        ))}
      </div>
    </div>
  );
}