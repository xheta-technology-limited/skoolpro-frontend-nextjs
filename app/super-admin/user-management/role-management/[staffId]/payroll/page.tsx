"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";
import { useGetPayroll } from "@/features/user-management/staff-management/api/get-payroll";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";

export default function Payroll() {
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;
  const [isEditMode, setEditMode] = useState<boolean>(false);

  const {
    data: payrollData,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetPayroll(staffId);

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-fit mx-auto">
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isRefetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      {isEditMode ? (
        <EditMode setEditMode={setEditMode} payroll={payrollData} />
      ) : (
        <ViewMode setEditMode={setEditMode} payroll={payrollData} />
      )}
    </>
  );
}