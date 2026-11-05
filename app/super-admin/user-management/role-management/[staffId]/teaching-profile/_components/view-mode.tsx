import { DetailField } from "@/components/common";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { Edit } from "iconsax-reactjs";
import { Dispatch, SetStateAction } from "react";
import { TeacherProfile } from "@/features/user-management/staff-management/types/api/teaching-profile";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  profileData: TeacherProfile;
}

//TODO: FIX THIS WHOLE COMPONENT NOT DISPLAYING THE FUCKING DATA GOTTEN FROM THE BACKEND
export default function ViewMode({ setEditMode, profileData }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Text className="text-neutrals-700">TEACHING PROFILE</Text>

        <Button
          onClick={() => setEditMode(true)}
          variant="secondary"
          size="sm"
          leftIcon={<Edit variant="Bulk" size={16} className="text-primary" />}
        >
          Edit
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
          <DetailField
            label="Teacher reg. number"
            value={profileData.teacher_registration_number ?? "-"}
          />
          <DetailField
            label="Period per week"
            value={profileData.max_teaching_load?.toString() ?? "-"}
          />
          <DetailField
            label="Register class"
            value={profileData.form_class_section.name ?? "-"}
          />
          <DetailField
            label="Skills"
            value={profileData.specialist_skills ?? "-"}
          />
          <DetailField
            label="Curriculum experience"
            value={profileData.curriculum_experience ?? "-"}
          />
        </div>
      </div>
    </div>
  );
}
