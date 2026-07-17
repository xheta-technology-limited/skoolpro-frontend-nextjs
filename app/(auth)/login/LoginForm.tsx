import { useForm, FormProvider } from "react-hook-form";
import { loginForm } from "./types";
import { Input } from "@/components/ui/form";
import { Text } from "@/components/ui";
import Link from "next/link";
import { linkVariants } from "@/styles";
import { Button } from "@/components/ui/button";
const onSubmit = (data: loginForm) => {
  console.log(data);
};
const LoginForm = () => {
  const methods = useForm<loginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-6 w-125"
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
          <Link className={linkVariants({ size: "lg" })} href={"/"}>
            Reset
          </Link>
        </Text>

        <Button size="lg" className="w-fit self-end">
          Login
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
