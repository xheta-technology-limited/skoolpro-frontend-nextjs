import Image from "next/image";

import DetailCard from "@/components/common/detail-card/DetailCard";
import { Button } from "@/components/ui/custom-button";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import type { GuardianDetail } from "@/features/user-management/guardian-management/types/guardian-detail-types";
import countryCodesList from "country-codes-list";

interface Props {
  onEdit: () => void;
  guardian: GuardianDetail;
}

const COUNTRY_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(
    countryCodesList.customList("countryCode", "{countryNameEn}")
  ).map(([code, name]) => [code, name as string])
);

const countryName = (value?: string | null) => {
  if (!value || value.trim() === "") return "Nil";
  return COUNTRY_NAME_BY_CODE[value.toUpperCase()] ?? value;
};

const fallback = (value?: string | null) =>
  value && value.trim() !== "" ? value : "Nil";

export default function ViewMode({ onEdit, guardian }: Props) {
  // Guardian's "nationality" is treated as a country value (resolved
  // via CountrySelectField in edit mode, same as the student form's
  // country_of_birth) rather than free text, so it's run through the
  // same countryName() lookup here for consistent display. Flagging
  // this as an interpretation, not something explicitly confirmed —
  // the student form's own "nationality" field is NOT resolved this
  // way (shown as plain fallback() text there), so there's some
  // inconsistency in how "nationality" is treated across the two
  // forms worth reconciling later if it turns out guardians store a
  // plain string here too, not a country code.
  const personalFields = [
    { label: "Title", value: guardian.title ? titleCase(guardian.title) : "Nil" },
    { label: "First name", value: fallback(guardian.first_name) },
    { label: "Middle name", value: fallback(guardian.middle_name) },
    { label: "Last name", value: fallback(guardian.last_name) },
    {
      label: "Gender",
      value: guardian.gender ? titleCase(guardian.gender) : "Nil",
    },
    { label: "Nationality", value: countryName(guardian.nationality) },
    { label: "Occupation", value: fallback(guardian.occupation) },
    { label: "Employer", value: fallback(guardian.employer) },
  ];

  const contactFields = [
    { label: "Phone number", value: fallback(guardian.phone) },
    { label: "Alt. phone number", value: fallback(guardian.alt_phone) },
    { label: "Email address", value: fallback(guardian.email) },
    {
      label: "Preferred contact method",
      value: guardian.preferred_contact_method
        ? titleCase(guardian.preferred_contact_method)
        : "Nil",
    },
    { label: "Home address", value: fallback(guardian.home_address) },
    { label: "Work address", value: fallback(guardian.work_address) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="font-poppins uppercase text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
          Parent details
        </span>

        <Button size="sm" variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative aspect-square w-full max-w-71 shrink-0 overflow-hidden rounded-[32px] border-4 border-primary bg-[#D9D9D9] sm:w-71">
          {guardian.photo_path ? (
            <Image
              src={guardian.photo_path}
              alt={guardian.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[13px] text-neutrals-500">
              No photo
            </div>
          )}
        </div>

        <div className="flex-1">
          <DetailCard fields={personalFields} />
        </div>
      </div>

      <DetailCard title="Contact details" fields={contactFields} />
    </div>
  );
}