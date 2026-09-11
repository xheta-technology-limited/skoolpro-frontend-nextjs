import Image from "next/image";
import { DetailField } from "@/components/common";
import { UserEdit } from "iconsax-reactjs";
import { staff } from "../constants";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
export default function ViewMode({ setEditMode }: Props) {
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
        <div className="relative h-71 w-71 flex items-center justify-center shrink-0 overflow-hidden rounded-ml border-4 border-primary">
          <Image
            src={staff.photoUrl}
            alt={`${staff.firstName} ${staff.lastName}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Detail fields grid */}
        <div className="rounded-ml bg-primary-bg min-w-76.75 gap-4 p-2 flex-1 grid grid-cols-2 content-start">
          <DetailField label="First name" value={staff.firstName} />
          <DetailField label="Middle name" value={staff.middleName} />
          <DetailField label="Last name" value={staff.lastName} />
          <DetailField label="Religion" value={staff.religion} />
          <DetailField label="Sex" value={staff.sex} />
          <DetailField label="D.O.B" value={staff.dob} />
          <DetailField label="Nationality" value={staff.nationality} />
          <DetailField label="Marital status" value={staff.maritalStatus} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Text className="text-neutrals-700">ROLE & EMPLOYMENT DETAILS</Text>

        <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
          <DetailField label="Staff number" value={staff.staffNumber} />
          <DetailField
            label="National/Prof. No."
            value={staff.nationalProfNo}
          />
          <DetailField label="Category" value={staff.category} />
          <DetailField
            label="Reporting manager"
            value={staff.reportingManager}
          />
          <DetailField label="Employment type" value={staff.employmentType} />
          <DetailField
            label="Employment starts"
            value={staff.employmentStarts}
          />
          <DetailField label="Department" value={staff.department} />
          <DetailField label="Contract type" value={staff.contractType} />
          <DetailField label="Staff status" value={staff.staffStatus} />
          <DetailField label="Campus" value={staff.campus} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Text className="text-neutrals-700">CONTACT DETAILS</Text>

        <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
          <DetailField label="Home address" value={staff.homeAddress} />
          <DetailField label="Email address" value={staff.emailAddress} />
          <DetailField label="Phone number" value={staff.phoneNumber} />
          <DetailField
            label="Emergency phone number"
            value={staff.emergencyPhoneNumber}
          />
        </div>
      </div>
    </>
  );
}
