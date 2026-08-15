"use client";
import { Input, DragNDrop } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { fourthFormSchema } from "@/features/onboard/schemas";
import type { FourthFormData } from "@/features/onboard/schemas";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";

export default function FourthForm() {
  const router = useProgressRouter();
  const methods = useForm<FourthFormData>({
    defaultValues: {},
    resolver: zodResolver(fourthFormSchema),
  });
  const onSubmit = () => {
    router.push("/subscriptions");
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 md:w-125 min-w-0 w-full"
      >
        <Input name="motto" label="Enter school motto" />
        <DragNDrop name="logo" label="school logo" />
        <DragNDrop name="license" label="school license" />
        <DragNDrop name="letterhead" label="school letterhead" />
        <Button className="self-end">Submit</Button>
      </form>
    </FormProvider>
  );
}
