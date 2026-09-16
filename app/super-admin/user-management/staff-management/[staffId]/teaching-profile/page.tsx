"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";
import SubjectsTaught from "./_components/subjects-taught";
import ClassesTaught from "./_components/classes-taught";
import { useGetTeachingProfile } from "@/features/user-management/staff-management/api/get-teaching-profile";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";

const dummySubjects = [];

const dummyClasses = [];

export default function TeachingProfile() {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;

  const {
    data: profileData,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetTeachingProfile(staffId);

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
        <EditMode setEditMode={setEditMode} profileData={profileData} />
      ) : (
        <ViewMode setEditMode={setEditMode} profileData={profileData} />
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:gap-8 p-2">
        <SubjectsTaught subjects={dummySubjects} isEditMode={isEditMode} />
        <ClassesTaught classes={dummyClasses} isEditMode={isEditMode} />
      </div>
    </>
  );
}
