import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { UserEdit } from "iconsax-reactjs";
import Image from "next/image";
import { DetailField } from "@/components/common";

interface StaffDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  religion: string;
  sex: string;
  dob: string;
  nationality: string;
  maritalStatus: string;
  photoUrl: string;
}

const staff: StaffDetails = {
  firstName: "Helen",
  middleName: "Mary",
  lastName: "Diana",
  religion: "Christian",
  sex: "Female",
  dob: "20/09/2014",
  nationality: "Nigerian",
  maritalStatus: "Married",
  photoUrl:
    "https://unsplash.com/photos/teacher-giving-question-dark-skinned-professional-teacher-giving-the-question-for-her-smart-pupils-IfG0gYY32G4",
};

// Fallback helper — anything missing renders as "-"
const fallback = (value?: string) =>
  value && value.trim() !== "" ? value : "-";

export default function ProfilePage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <Text>STAFF DETAILS</Text>
        <Button
          variant="secondary"
          size="sm"
          rightIcon={
            <UserEdit variant="Bulk" size={16} className="text-primary" />
          }
        >
          Edit
        </Button>
      </div>

      <div className="flex gap-4 mt-4">
        {/* Profile photo */}
        <div className="relative max-h-71 max-w-71 shrink-0 overflow-hidden rounded-ml border-2 border-primary">
          <Image
            src={staff.photoUrl}
            alt={`${staff.firstName} ${staff.lastName}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Detail fields grid */}
        <div className="rounded-ml bg-primary-bg gap-4 p-4 flex-1 grid grid-cols-2 content-start">
          <DetailField label="First name" value={fallback(staff.firstName)} />
          <DetailField label="Middle name" value={fallback(staff.middleName)} />
          <DetailField label="Last name" value={fallback(staff.lastName)} />
          <DetailField label="Religion" value={fallback(staff.religion)} />
          <DetailField label="Sex" value={fallback(staff.sex)} />
          <DetailField label="D.O.B" value={fallback(staff.dob)} />
          <DetailField
            label="Nationality"
            value={fallback(staff.nationality)}
          />
          <DetailField
            label="Marital status"
            value={fallback(staff.maritalStatus)}
          />
        </div>
      </div>
    </>
  );
}
