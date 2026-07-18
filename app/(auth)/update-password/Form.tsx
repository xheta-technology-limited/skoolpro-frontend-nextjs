"use client";
import { useForm, FormProvider } from "react-hook-form";
import { passwordForm } from "./types";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "./_schemas/reset-password-schema";
import { SuccessModal } from "@/components/common";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Form = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const methods = useForm<passwordForm>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit = (data: passwordForm) => {
    console.log(data);
    setOpen(true);
  };
  const onClose = () => setOpen(false);
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col sm:h-auto gap-6 w-125"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Input name="password" label="Enter a password" type="password" />
          <Input
            name="confirmPassword"
            label="Confirm password"
            type="password"
          />

          <Button
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
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
