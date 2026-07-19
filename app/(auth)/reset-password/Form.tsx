"use client";
import { useForm, FormProvider } from "react-hook-form";
import { passwordForm } from "./types";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "./_schemas/reset-password-schema";
import { SuccessModal } from "@/components/common";
import { useState } from "react";

const Form = () => {
  const [open, setOpen] = useState(false);
  const methods = useForm<passwordForm>({
    defaultValues: {
      email: "",
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
          <Input name="email" label="Enter email" type="email" />

          <Button
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
          >
            Send password reset link
          </Button>
        </form>
      </FormProvider>
      <SuccessModal
        isOpen={open}
        onClose={onClose}
        subheading="A password reset link has been sent to your email."
      >
        <Button onClick={onClose} size="lg">
          Okay
        </Button>
      </SuccessModal>
    </>
  );
};

export default Form;
