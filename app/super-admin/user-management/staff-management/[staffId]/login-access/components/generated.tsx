"use client";
import DetailField from "@/app/onboarding/_components/DetailField";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Copy } from "iconsax-reactjs";

interface Props {
  password: string;
}
export default function Generated({ password }: Props) {
  const onReset = () => {
    alert("Does nothing.");
  };

  const onCopy = () => {
    alert("text copied(not really, implement this)");
  };
  return (
    <>
      <div className="mb-4 p-4 flex justify-between items-center border border-primary-100 bg-primary-bg">
        {password && (
          <div className="gap-3 flex flex-col">
            <Text scale={"content"} className="text-neutrals-900">
              Temporary password - shown once
            </Text>
            <Text scale={"content"} weight={"accent"}>
              {password}
            </Text>
          </div>
        )}

        <Button
          onClick={onCopy}
          variant="secondary"
          leftIcon={<Copy variant="Bulk" size={16} className="text-primary" />}
          size="sm"
        >
          Copy
        </Button>
      </div>

      <div className="rounded-ml mb-8 bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
        <DetailField label="Account status" value="Linked" />
        <DetailField
          label="Sign in email"
          value="grace.bello@brightfuture.test"
        />
        <DetailField label="Role" value="Teacher" />
        <DetailField
          label="Must change password"
          value="Yes - on first sign in"
        />
      </div>

      <Button
        variant="secondary"
        className="justify-self-end"
        onClick={onReset}
      >
        Reset temporary password
      </Button>
    </>
  );
}
