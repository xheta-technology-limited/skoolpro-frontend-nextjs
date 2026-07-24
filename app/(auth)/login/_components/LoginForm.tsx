"use client";
import { useForm, FormProvider } from "react-hook-form";
import { loginForm } from "@/features/auth/types/types";
import { Input } from "@/components/ui/form";
import { Text } from "@/components/ui";
import Link from "next/link";
import { linkVariants } from "@/styles";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/features/auth/schemas/login-form-schema";
import { useSanctumCookie } from "@/features/auth/api/login";
import { useLogin } from "@/features/auth/api/login";
import { useEffect } from "react";

const LoginForm = () => {
  useEffect(() => {
    console.log("UWU :3");
    const handleOffline = () => {
      console.log(
        "HERE WE FUCKING GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"
      );
    };

    const handleOnline = () => {
      console.log(
        "WE'RE ONLINNENENNENENEN AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      );
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      handleOffline();
    }

    // return () => {
    //   window.removeEventListener("offline", handleOffline);
    //   window.removeEventListener("online", handleOnline);
    // };
  }, []);

  const { isSuccess } = useSanctumCookie();
  const methods = useForm<loginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(userSchema),
  });
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: loginForm) => {
    mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col sm:h-auto gap-6 w-125"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Input name="email" label="Enter email or phone number" type="email" />

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
  );
};

export default LoginForm;
