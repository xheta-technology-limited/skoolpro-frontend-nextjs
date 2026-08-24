"use client";
import { useForm, FormProvider } from "react-hook-form";
import { loginForm } from "@/features/auth/types/types";
import { Input } from "@/components/ui/form";
import { Text } from "@/components/ui";
import Link from "next/link";
import { linkVariants } from "@/styles";
import { Button } from "@/components/ui/custom-button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormData,
  userSchema,
} from "@/features/auth/schemas/login-form-schema";
import { useLogin } from "@/features/auth/api/login";
import { useState } from "react";
import SuccessModal from "@/components/common/successModal/modal";
import { useAuth } from "../../../../features/auth/auth-store";
import { useUserStore } from "@/features/user/user.store";
import { useProgressRouter } from "@/features/page-loader";
import { setFormErrors } from "@/lib/helpers/set-form-errors";
import { navigateOnLogin } from "@/lib/helpers/navigate-on-login";
import { useGetSchoolProfile } from "@/features/school-profile/api/get-school-profile";
import { useUserStore as useSchoolProfileStore } from "@/features/school-profile/school-profile.store";
import { Spinner } from "@/components/animations";
import { ApiError } from "@/lib/api";

const LoginForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCheckingSchool, setIsCheckingSchool] = useState(false);
  const router = useProgressRouter();
  const methods = useForm<LoginFormData>({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: zodResolver(userSchema),
  });
  const { mutate, isPending } = useLogin();
  const updateMFAData = useAuth((state) => state.updateData);
  const updateUserData = useUserStore((state) => state.updateData);
  const userData = useUserStore((s) => s.data);
  const updateSchoolProfileData = useSchoolProfileStore(
    (state) => state.updateData
  );
  const { refetch: refetchSchoolProfile } = useGetSchoolProfile({
    enabled: false,
    retry: false,
  });

  const checkSchoolAndProceed = async (mfa: boolean) => {
    setIsCheckingSchool(true);
    try {
      const { data: schoolProfile, error } = await refetchSchoolProfile();
      if (schoolProfile) {
        updateSchoolProfileData(schoolProfile);
        setModalOpen(true);
      } else if (error && error instanceof ApiError && error.status === 404) {
        router.replace("/onboarding");
      }
    } finally {
      setIsCheckingSchool(false);
      setModalOpen(true);
    }
  };

  const onSubmit = (data: loginForm) => {
    mutate(data, {
      onSuccess: (res) => {
        if ("mfa_required" in res) {
          updateMFAData("challenge_id", res.challenge_id);
          updateMFAData("available_methods", res.available_methods);
          router.replace("/mfa");
        }
        if ("first_name" in res) {
          updateUserData(res);
          checkSchoolAndProceed(res.mfa_enabled);
        }
      },
      onError: (res) => {
        if (res.errors) {
          setFormErrors(methods.setError, res.errors);
        }
      },
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col sm:h-auto gap-6 w-125"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Input name="login" label="Enter email or phone number" />

          <Input name="password" label="Enter your password" type="password" />

          <Text
            className="self-end"
            as="p"
            scale={"highlight"}
            weight={"standard"}
          >
            Forgot Password?{" "}
            <Link
              className={linkVariants({ size: "lg" })}
              href={"/reset-password"}
            >
              Reset
            </Link>
          </Text>

          <Button
            loading={isPending}
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
          >
            Login
          </Button>
        </form>
      </FormProvider>
      {isCheckingSchool && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white">
          <Spinner size={48} />
          <Text scale="content">Checking school availability</Text>
        </div>
      )}
      <SuccessModal
        subheading="Your login is successful. Kindly click the button to proceed."
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex justify-between gap-2 md:gap-6 items-center w-full">
          <Button
            onClick={() => navigateOnLogin(userData?.active_role || "", router)}
            variant="secondary"
            size="lg"
            className="flex-1 min-w-0"
          >
            Proceed to dashboard
          </Button>
          <Button
            size="lg"
            className="flex-1 min-w-0"
            onClick={() => router.replace("/mfa-setup")}
          >
            Set up MFA
          </Button>
        </div>
      </SuccessModal>
    </>
  );
};

export default LoginForm;
