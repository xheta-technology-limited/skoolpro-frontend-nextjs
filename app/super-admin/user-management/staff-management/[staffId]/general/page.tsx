import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { AddSquare, Edit, UserEdit } from "iconsax-reactjs";
import Image from "next/image";
import { DetailField } from "@/components/common";
import { qualifications, staff } from "./constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";

// Fallback helper — anything missing renders as "-"
const fallback = (value?: string) =>
  value && value.trim() !== "" ? value : "-";

const qualificationsHeadRow = [
  "Type",
  "Qualification",
  "Institution",
  "Awarded",
  "Grade",
  "Reg No.",
  "Expires",
  "Action",
];

export default function ProfilePage() {
  return (
    <>
      <div className="flex flex-col gap-8 w-full">
        <div className="flex justify-between items-center">
          <Text className="text-neutrals-700">STAFF DETAILS</Text>
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
            <DetailField label="First name" value={fallback(staff.firstName)} />
            <DetailField
              label="Middle name"
              value={fallback(staff.middleName)}
            />
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

        <div className="flex flex-col gap-4">
          <Text className="text-neutrals-700">ROLE & EMPLOYMENT DETAILS</Text>

          <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
            <DetailField
              label="Staff number"
              value={fallback(staff.staffNumber)}
            />
            <DetailField
              label="National/Prof. No."
              value={fallback(staff.nationalProfNo)}
            />
            <DetailField label="Category" value={fallback(staff.category)} />
            <DetailField
              label="Reporting manager"
              value={fallback(staff.reportingManager)}
            />
            <DetailField
              label="Employment type"
              value={fallback(staff.employmentType)}
            />
            <DetailField
              label="Employment starts"
              value={fallback(staff.employmentStarts)}
            />
            <DetailField
              label="Department"
              value={fallback(staff.department)}
            />
            <DetailField
              label="Contract type"
              value={fallback(staff.contractType)}
            />
            <DetailField
              label="Staff status"
              value={fallback(staff.staffStatus)}
            />
            <DetailField label="Campus" value={fallback(staff.campus)} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Text className="text-neutrals-700">CONTACT DETAILS</Text>

          <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
            <DetailField
              label="Home address"
              value={fallback(staff.homeAddress)}
            />
            <DetailField
              label="Email address"
              value={fallback(staff.emailAddress)}
            />
            <DetailField
              label="Phone number"
              value={fallback(staff.phoneNumber)}
            />
            <DetailField
              label="Emergency phone number"
              value={fallback(staff.emergencyPhoneNumber)}
            />
          </div>
        </div>

        {/* Qualifications */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text className="text-neutrals-700">QUALIFICATIONS</Text>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                <AddSquare variant="Bulk" size={16} className="text-primary" />
              }
            >
              Add
            </Button>
          </div>

          <div className="rounded-ml bg-primary-bg p-2">
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    {qualificationsHeadRow.map((col, index) => {
                      const isMiddle =
                        index != 0 && index != qualificationsHeadRow.length - 1;
                      const style = isMiddle
                        ? "border-t-[1px] border-b-[1px]"
                        : "";
                      return (
                        <TableHead className={style} key={col}>
                          {col}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {qualifications.map((qual) => (
                    <TableRow key={qual.id}>
                      <TableCell>{fallback(qual.type)}</TableCell>
                      <TableCell>{fallback(qual.qualification)}</TableCell>
                      <TableCell className="truncate max-w-30">
                        {fallback(qual.institution)}
                      </TableCell>
                      <TableCell>{fallback(qual.awarded)}</TableCell>
                      <TableCell>{fallback(qual.grade)}</TableCell>
                      <TableCell>{fallback(qual.regNo)}</TableCell>
                      <TableCell>{fallback(qual.expires)}</TableCell>
                      <TableCell>
                        <button className="border-grays-borders text-neutrals-700 px-2 py-1.5 border flex gap-1 items-center rounded-[12px]">
                          <Edit
                            size={14}
                            variant="Bulk"
                            className="text-neutrals-800"
                          />
                          <Text scale={"caption"} className="text-neutrals-700">
                            Edit
                          </Text>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>
        </div>
      </div>
    </>
  );
}
