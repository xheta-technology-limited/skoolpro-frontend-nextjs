import Image from "next/image";
import { DetailField } from "@/components/common";
import { UserEdit } from "iconsax-reactjs";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Dispatch, SetStateAction } from "react";
import { Staff } from "@/features/user-management/staff-management/types/api/staff";
import { titleCase } from "@/lib/helpers";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  profileData: Staff;
}

const formatField = (value: string | null | undefined): string => {
  if (!value || value === "-") return "-";
  return titleCase(value);
};

export default function ViewMode({ setEditMode, profileData }: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <Text className="text-neutrals-700">STAFF DETAILS</Text>
        <Button
          onClick={() => setEditMode(true)}
          variant="secondary"
          size="sm"
          rightIcon={
            <UserEdit variant="Bulk" size={16} className="text-primary" />
          }
        >
          Edit
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {/* Profile photo */}
        <div className="relative h-71 w-71 flex items-center justify-center shrink-0 overflow-hidden rounded-ml border-4 border-primary bg-[#D9D9D9]">
          {profileData.photo_path ? (
            <Image
              src={profileData.photo_path ?? "/images/staff-placeholder.jpg"}
              alt={`${profileData.first_name} ${profileData.last_name}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[13px] text-neutrals-500">
              No photo
            </div>
          )}
        </div>

        {/* Detail fields grid */}
        <div className="rounded-ml bg-primary-bg min-w-76.75 gap-4 p-2 flex-1 grid grid-cols-2 content-start">
          <DetailField label="First name" value={formatField(profileData.first_name)} />
          <DetailField
            label="Middle name"
            value={formatField(profileData.middle_name)}
          />
          <DetailField label="Last name" value={formatField(profileData.last_name)} />
          <DetailField label="Religion" value={formatField("no_backend_data")} />
          <DetailField label="Sex" value={formatField(profileData.gender)} />
          <DetailField label="D.O.B" value={profileData.date_of_birth ?? "-"} />
          <DetailField
            label="Nationality"
            value={formatField(profileData.nationality)}
          />
          <DetailField label="Marital status" value={formatField("no_backend_data")} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Text className="text-neutrals-700">ROLE & EMPLOYMENT DETAILS</Text>

        <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
          <DetailField
            label="Staff number"
            value={profileData.staff_number ?? "-"}
          />
          <DetailField
            label="National/Prof. No."
            value={profileData.national_reg_number ?? "-"}
          />
          <DetailField label="Category" value={formatField(profileData.category)} />
          <DetailField
            label="Reporting manager"
            value={profileData.reporting_manager_id ?? "-"}
          />
          <DetailField
            label="Employment type"
            value={formatField(profileData.employment_type)}
          />
          <DetailField
            label="Employment starts"
            value={profileData.employment_start_date ?? "-"}
          />
          <DetailField
            label="Department"
            value={formatField(profileData.department)}
          />
          <DetailField
            label="Contract type"
            value={formatField(profileData.contract_type)}
          />
          <DetailField
            label="Staff status"
            value={formatField(profileData.staff_status)}
          />
          <DetailField label="Campus" value={profileData.campus_id ?? "-"} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Text className="text-neutrals-700">CONTACT DETAILS</Text>

        <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
          <DetailField
            label="Home address"
            value={formatField(profileData.address)}
          />
          <DetailField label="Email address" value={profileData.email ?? "-"} />
          <DetailField label="Phone number" value={formatField(profileData.phone)} />
          <DetailField
            label="Emergency phone number"
            value={formatField("no_backend_data")}
          />
        </div>
      </div>
    </>
  );
}