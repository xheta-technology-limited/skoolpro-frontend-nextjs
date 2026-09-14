"use client";

import { AttachSquare } from "iconsax-reactjs";

import { Button } from "@/components/ui/custom-button";
import { StatusBadge } from "@/components/common";

const ROLE_ACTIONS = [
  { id: "graduate", label: "Graduate", tone: "primary" as const },
  { id: "suspend", label: "Suspend", tone: "primary" as const },
  { id: "deactivate", label: "Deactivate", tone: "primary" as const },
  { id: "withdraw", label: "Withdraw", tone: "danger" as const },
  { id: "transfer-out", label: "Transfer out", tone: "danger" as const },
  { id: "expel", label: "Expel", tone: "danger" as const },
  { id: "mark-deceased", label: "Mark deceased", tone: "danger" as const },
];

function noop() {}

export default function StudentStatusPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
            ROLE STATUS
          </span>
          <StatusBadge data="Active" variant="green" />
        </div>

        <div className="flex flex-wrap gap-3">
          {ROLE_ACTIONS.map((action) => (
            <Button
              key={action.id}
              type="button"
              variant="secondary"
              size="md"
              onClick={noop}
              leftIcon={
                <AttachSquare size={20} variant="Bulk" color="currentColor" />
              }
              className={
                action.tone === "danger"
                  ? "border-error-200! text-error-200!"
                  : undefined
              }
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
          ADMISSION STATUS
        </span>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div className="w-full lg:w-118.5 lg:shrink-0">
            <label
              htmlFor="admission_status"
              className="mb-2 block font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700"
            >
              Admission status
            </label>
            <div
              id="admission_status"
              className="flex min-h-12.75 w-full items-center rounded-2xl bg-primary-bg px-5 py-4 text-[0.875rem] text-neutrals-400 md:text-[1rem] lg:h-12.75"
            >
              Enrolled
            </div>
          </div>

          <p className="flex-1 font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700 sm:pt-7">
            applicant → offered → accepted → enrolled · deferred / waitlisted
            / rejected / withdrawn
          </p>
        </div>
      </div>
    </div>
  );
}