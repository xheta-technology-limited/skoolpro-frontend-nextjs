"use client";
import { useForm, FormProvider } from "react-hook-form";
import { passwordForm } from "./types";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "./_schemas/reset-password-schema";
import { SuccessModal } from "@/components/common";
import { useState } from "react";
import { useProgressRouter } from "@/features/page-loader";
import { useResetPassword } from "@/features/auth/api/forgot-password";
import { useResetPasswordStore } from "@/features/auth/auth-store";

const Form = () => {
  const [open, setOpen] = useState(false);
  const router = useProgressRouter();
  const { mutate, isPending } = useResetPassword();
  const store = useResetPasswordStore((state) => state.data);
  const methods = useForm<passwordForm>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit = (data: passwordForm) => {
    mutate(
      { ...data, ...store },
      {
        onSuccess: () => {
          setOpen(true);
        },
      }
    );
  };
  const onClose = () => {
    setOpen(false);
    router.push("/login");
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col sm:h-auto gap-6 w-125"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Input name="password" label="Enter a password" type="password" />
          <Input
            name="password_confirmation"
            label="Confirm password"
            type="password"
          />

          <Button
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            loading={isPending}
          >
            Update password
          </Button>
        </form>
      </FormProvider>
      <SuccessModal
        isOpen={open}
        onClose={onClose}
        subheading="Your password reset was successful"
      >
        <Button onClick={() => router.push("/login")} size="lg">
          Proceed to login
        </Button>
      </SuccessModal>
    </>
  );
};

export default Form;
