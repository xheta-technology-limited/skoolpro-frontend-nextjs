"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";
import SubjectsTaught from "./_components/subjects-taught";
import ClassesTaught from "./_components/classes-taught";
import { useGetTeachingProfile } from "@/features/user-management/staff-management/api/get-teaching-profile";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import {
  Section,
  Subject,
} from "@/features/user-management/staff-management/types/api/teaching-profile";

export default function TeachingProfile() {
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;

  const {
    data: profileData,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetTeachingProfile(staffId);

  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sectionIds, setSectionIds] = useState<Section[]>([]);
  const [prevProfile, setPrevProfile] = useState(profileData);

  if (profileData !== prevProfile) {
    setPrevProfile(profileData);
    setSubjects(profileData?.subjects ?? []);
    setSectionIds(profileData?.sections ?? []);
  }

  useEffect(() => {
    console.log("zee profile: ", prevProfile);
    console.log("profile's subs: ", profileData?.subjects);
  }, [prevProfile]);
  useEffect(() => {
    console.log("zee subjects: ", subjects);
  }, [subjects]);
  useEffect(() => {
    console.log("zee sections: ", sectionIds);
  }, [sectionIds]);
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
        <EditMode
          setEditMode={setEditMode}
          profileData={profileData.profile}
          subjects={subjects}
          sectionIds={sectionIds}
        />
      ) : (
        <ViewMode setEditMode={setEditMode} profileData={profileData.profile} />
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:gap-8 p-2">
        <SubjectsTaught
          selectedSubjects={subjects}
          onAddSubjects={setSubjects}
          isEditMode={isEditMode}
        />
        <ClassesTaught
          selectedClasses={sectionIds}
          onAddClasses={setSectionIds}
          isEditMode={isEditMode}
        />
      </div>
    </>
  );
}
