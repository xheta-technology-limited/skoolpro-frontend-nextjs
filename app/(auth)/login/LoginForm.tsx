import { useForm, FormProvider } from "react-hook-form";
import { loginForm } from "./types";
import { Input } from "@/components/ui/form";
import { Text } from "@/components/ui";
import Link from "next/link";
import { linkVariants } from "@/styles";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./_schemas/login-form-schema";

const onSubmit = (data: loginForm) => {
  console.log(data);
};
const LoginForm = () => {
  const methods = useForm<loginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(userSchema),
  });
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
          <Link className={linkVariants({ size: "lg" })} href={"/"}>
            Reset
          </Link>
        </Text>

        <Button size="lg" className="w-full mt-auto sm:mt-0 sm:w-fit self-end">
          Login
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
