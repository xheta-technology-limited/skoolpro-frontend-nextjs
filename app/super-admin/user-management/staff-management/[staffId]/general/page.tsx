"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { AddSquare, Edit, Trash } from "iconsax-reactjs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { useState } from "react";
import QualificationModal from "./_components/qualification-modal";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";
import { useGetStaff } from "@/features/user-management/staff-management/api/get-staff";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { useListStaffQualifications } from "@/features/user-management/staff-management/api/list-qualifications";
import { StaffQualification } from "@/features/user-management/staff-management/types/api/qualification";
import { titleCase } from "@/lib/helpers";
import { useDeleteStaff } from "@/features/user-management/staff-management/api/delete-staff";
import { useRemoveQualification } from "@/features/user-management/staff-management/api/remove-qualification";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { toast } from "sonner";

// Fallback helper — anything missing renders as "-"
const fallback = (value?: string | null) =>
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
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [editingQualification, setEditingQualification] =
    useState<StaffQualification | null>(null);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const params = useParams<{ staffId: string }>();
  const userID = params.staffId;
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useProgressRouter();

  const openAddModal = () => {
    setEditingQualification(null);
    setModalOpen(true);
  };

  const openEditModal = (qualification: StaffQualification) => {
    setEditingQualification(qualification);
    setModalOpen(true);
  };

  const { data: qualificationData, error: qualificationError } =
    useListStaffQualifications(userID);
  const { mutate: deleteMutate, isPending: isDeletePending } = useDeleteStaff();
  const {
    mutate: removeQualificationMutate,
    isPending: isRemoveQualificationPending,
  } = useRemoveQualification();

  const onRemoveQualification = (qualification: StaffQualification) => {
    removeQualificationMutate(
      { staffId: userID, qualificationId: qualification.id },
      {
        onSuccess: () => toast.success("Qualification deleted successfully"),
      }
    );
  };

  const onDelete = () => {
    deleteMutate(
      { staffId: userID },
      {
        onSuccess: () =>
          router.push("/super-admin/user-management/staff-management"),
      }
    );
  };

  const {
    data: profileData,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetStaff(userID);

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isRefetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }
  return (
    <>
      <QualificationModal
        open={isModalOpen}
        onOpenChange={() => setModalOpen(false)}
        qualification={editingQualification}
      />
      <div className="flex flex-col gap-8 w-full">
        {isEditMode ? (
          <EditMode setEditMode={setEditMode} profileData={profileData} />
        ) : (
          <ViewMode setEditMode={setEditMode} profileData={profileData} />
        )}

        {/* Qualifications */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text className="text-neutrals-700">QUALIFICATIONS</Text>
            <Button
              variant="secondary"
              onClick={() => {
                openAddModal();
              }}
              size="sm"
              leftIcon={
                <AddSquare variant="Bulk" size={16} className="text-primary" />
              }
            >
              Add
            </Button>
          </div>

          {qualificationData && qualificationData.length === 0 && (
            <>
              <div className="flex h-full w-full items-center justify-center text-[13px] text-neutrals-500">
                No qualifications
              </div>
            </>
          )}
          {qualificationError && (
            <>
              <div className="flex h-full w-full items-center justify-center text-[13px] text-neutrals-500">
                {qualificationError.message}
              </div>
            </>
          )}
          {qualificationData && qualificationData.length > 0 && (
            <div className="rounded-ml bg-primary-bg p-2">
              <TableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {qualificationsHeadRow.map((col, index) => {
                        const isMiddle =
                          index != 0 &&
                          index != qualificationsHeadRow.length - 1;
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
                    {qualificationData.map((qual) => (
                      <TableRow key={qual.id}>
                        <TableCell>{fallback(titleCase(qual.type))}</TableCell>
                        <TableCell>
                          {fallback(titleCase(qual.qualification))}
                        </TableCell>
                        <TableCell className="truncate max-w-30">
                          {fallback(qual.institution)}
                        </TableCell>
                        <TableCell>
                          {fallback(qual.award_date?.split("-")[0])}
                        </TableCell>
                        <TableCell>{fallback(qual.grade)}</TableCell>
                        <TableCell>
                          {fallback(qual.professional_registration)}
                        </TableCell>
                        <TableCell>{fallback(qual.expiry_date)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <button
                              className="border-grays-borders text-neutrals-700 px-2 py-1.5 border flex gap-1 items-center rounded-[12px]"
                              onClick={() => openEditModal(qual)}
                            >
                              <Edit
                                size={14}
                                variant="Bulk"
                                className="text-neutrals-800"
                              />
                              <Text
                                scale={"caption"}
                                className="text-neutrals-700"
                              >
                                Edit
                              </Text>
                            </button>
                            <button
                              className="border-grays-borders text-neutrals-700 px-2 py-1.5 border flex gap-1 items-center rounded-[12px]"
                              onClick={() => onRemoveQualification(qual)}
                              disabled={isRemoveQualificationPending}
                            >
                              <Trash
                                size={14}
                                variant="Bulk"
                                className="text-error-200"
                              />
                              <Text
                                scale={"caption"}
                                className="text-neutrals-700"
                              >
                                Delete
                              </Text>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            </div>
          )}
        </div>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={() => alert("Not implemented")}>
            Suspend user
          </Button>
          <Button onClick={() => alert("Not implemented")}>
            Disable user account
          </Button>
        </div>
        <FormModal
          onOpenChange={() => setDeleteModal(false)}
          open={deleteModal}
          title="Delete staff"
        >
          <>
            <Text>Delete this staff account?</Text>
            <div className="flex items-center justify-between">
              <Button onClick={() => setDeleteModal(false)}>No</Button>
              <Button
                variant="secondary"
                loading={isDeletePending}
                onClick={onDelete}
              >
                <Text className="text-error-200">Yes, delete</Text>
              </Button>
            </div>
          </>
        </FormModal>

        <Button
          onClick={() => setDeleteModal(true)}
          variant="tertiary"
          className="m-auto"
        >
          <Text scale={"highlight"} className="text-error-200">
            Delete user account
          </Text>
        </Button>
      </div>
    </>
  );
}
