"use client";
import { useForm, FormProvider } from "react-hook-form";
import { loginForm } from "@/features/auth/types/types";
import { Input } from "@/components/ui/form";
import { Text } from "@/components/ui";
import Link from "next/link";
import { linkVariants } from "@/styles";
import { Button } from "@/components/ui/custom-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/features/auth/schemas/login-form-schema";
import { useLogin } from "@/features/auth/api/login";
import { useState } from "react";
import SuccessModal from "@/components/common/successModal/modal";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const methods = useForm<loginForm>({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: zodResolver(userSchema),
  });
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: loginForm) => {
    mutate(data, {
      onSuccess: (res) => {
        if ("mfa_required" in res) {
          //TODO: add mfa steps
        }
        if ("mfa_enabled" in res) {
          res.mfa_enabled === false && setModalOpen(true);
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
      <SuccessModal
        subheading="Your login is successful. Kindly click the button to proceed."
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex justify-between gap-2 md:gap-6 items-center w-full">
          <Button variant="secondary" size="lg" className="flex-1 min-w-0">
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
