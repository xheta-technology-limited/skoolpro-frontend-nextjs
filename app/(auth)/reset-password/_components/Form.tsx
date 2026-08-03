"use client";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../../../features/auth/schemas/reset-password-schema";
import { useForgotPassword } from "@/features/auth/api/forgot-password";
import { ForgotPasswordRequest } from "@/features/auth/types/api/forgot-password";
import { toast } from "sonner";
import { useResetPasswordStore } from "@/features/auth/auth-store";
import { useRouter } from "next/navigation";

const Form = () => {
  const router = useRouter();
  const { mutate, isPending } = useForgotPassword();
  const updateStoreField = useResetPasswordStore((state) => state.updateField);

  const methods = useForm<ForgotPasswordRequest>({
    defaultValues: {
      login: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });
  const onSubmit = (data: ForgotPasswordRequest) => {
    mutate(data, {
      onSuccess: () => {
        updateStoreField("login", data.login);
        toast.success("An OTP has been sent to your email!");
        router.push("reset-password/otp");
      },
    });
  };
  return (
    <div className="flex flex-col gap-3.5">
      <FormProvider {...methods}>
        <form
          className="flex flex-col sm:h-auto gap-6 w-125"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Input name="login" label="Enter email or phone number" />
          <Button
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            loading={isPending}
          >
            Send password reset code
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Form;
