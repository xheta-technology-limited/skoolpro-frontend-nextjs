import { useCallback, useState } from "react";
import { useGetSchoolProfile } from "@/features/school-profile/api/get-school-profile";
import { useUserStore as useSchoolProfileStore } from "@/features/school-profile/school-profile.store";
import { useProgressRouter } from "@/features/page-loader";
import { ApiError } from "@/lib/api";

export const useSchoolCheck = () => {
  const [isCheckingSchool, setIsCheckingSchool] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [hasSchoolCheckError, setHasSchoolCheckError] = useState(false);
  const router = useProgressRouter();
  const updateSchoolProfileData = useSchoolProfileStore(
    (state) => state.updateData
  );
  const { refetch: refetchSchoolProfile } = useGetSchoolProfile({
    enabled: false,
    retry: false,
  });

  const checkSchoolAndProceed = useCallback(async () => {
    setIsCheckingSchool(true);
    setHasSchoolCheckError(false);
    try {
      const { data: schoolProfile, error } = await refetchSchoolProfile();
      if (schoolProfile) {
        updateSchoolProfileData(schoolProfile);
        setModalOpen(true);
      } else if (error && error instanceof ApiError && error.status === 404) {
        router.replace("/onboarding");
      } else {
        setHasSchoolCheckError(true);
      }
    } catch {
      setHasSchoolCheckError(true);
    } finally {
      setIsCheckingSchool(false);
    }
  }, [refetchSchoolProfile, router, updateSchoolProfileData]);

  return {
    isCheckingSchool,
    isModalOpen,
    setModalOpen,
    hasSchoolCheckError,
    setHasSchoolCheckError,
    checkSchoolAndProceed,
  };
};
