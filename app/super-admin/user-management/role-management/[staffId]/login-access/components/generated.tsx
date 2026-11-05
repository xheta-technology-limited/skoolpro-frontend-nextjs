"use client";
import DetailField from "@/app/onboarding/_components/DetailField";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { LinkedUser } from "@/features/user-management/staff-management";
import { useResetTempPassword } from "@/features/user-management/staff-management/api/reset-temp-password";
import { titleCase } from "@/lib/helpers";
import { Copy } from "iconsax-reactjs";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
  password: string | undefined;
  setPassword: Dispatch<SetStateAction<string | undefined>>;
  data: LinkedUser;
}
export default function Generated({ password, data, setPassword }: Props) {
  const params = useParams<{ staffId: string }>();
  const { mutate, isPending } = useResetTempPassword(params.staffId);
  const onReset = () => {
    mutate(
      { roles: data.roles },
      {
        onSuccess: (data) => {
          setPassword(data.temporary_password);
          toast.success("Password reset successfully");
        },
      }
    );
  };

  const onCopy = async () => {
    if (!password) {
      return;
    }
    await navigator.clipboard.writeText(password);
    toast.success("Text copied to clipboard");
  };
  return (
    <>
      {password && (
        <div className="mb-4 p-4 flex justify-between items-center border border-primary-100 bg-primary-bg">
          <div className="gap-3 flex flex-col">
            <Text scale={"content"} className="text-neutrals-900">
              Temporary password - shown once
            </Text>
            <Text scale={"content"} weight={"accent"}>
              {password}
            </Text>
          </div>

          <Button
            onClick={onCopy}
            variant="secondary"
            leftIcon={
              <Copy variant="Bulk" size={16} className="text-primary" />
            }
            size="sm"
          >
            Copy
          </Button>
        </div>
      )}

      <div className="rounded-ml mb-8 bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
        <DetailField label="Account status" value="Linked" />
        <DetailField label="Sign in email" value={data.email || "-"} />
        <DetailField label="Role" value={titleCase(data.roles.join(","))} />
        <DetailField
          label="Must change password"
          value={data.must_change_password ? "Yes - on first sign in" : "No"}
        />
      </div>

      <Button
        variant="secondary"
        className="justify-self-end"
        onClick={onReset}
        loading={isPending}
      >
        Reset temporary password
      </Button>
    </>
  );
}
