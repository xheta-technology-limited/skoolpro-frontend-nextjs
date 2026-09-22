"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import RecordTableSection, {
  type RecordTableRow,
} from "@/components/common/record-table-section/RecordTableSection";
import { Button } from "@/components/ui/custom-button";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import { useGetStudent } from "@/features/user-management/student-management/api/get-student";
import { useDeleteStudent } from "@/features/user-management/student-management/api/delete-student";
import type { StudentGuardian } from "@/features/user-management/student-management/types/student-detail-types";
import { useProgressRouter } from "@/features/page-loader";
import { toast } from "sonner";

import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";

function getGuardianResponsibility(guardian: StudentGuardian): string {
  const { link } = guardian;
  if (link.authorised_to_collect) return "Authorized to collect";
  if (link.is_financially_responsible) return "Financial";
  if (link.can_make_decisions) return "Decision making";
  if (link.receives_academic_reports) return "Academic reports";
  if (link.receives_medical_info) return "Medical info";
  return "—";
}

export default function StudentGeneralPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;
  const router = useProgressRouter();

  const [isEditMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    data: student,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetStudent(studentId);

  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();

  const onDelete = () => {
    deleteStudent(
      { studentId },
      {
        onSuccess: () => {
          toast.success("Student deleted successfully");
          router.push("/super-admin/user-management/student-management");
        },
      }
    );
  };

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="w-fit mx-auto">
        <NoData
          variant="signal"
          title="Something went wrong"
          subTitle={error?.message || ""}
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

  const noop = () => {};

  return (
    <div className="flex flex-col gap-6 w-full">
      {isEditMode ? (
        <EditMode
          student={student}
          onCancel={() => setEditMode(false)}
          onSaved={() => setEditMode(false)}
        />
      ) : (
        <ViewMode student={student} onEdit={() => setEditMode(true)} />
      )}

      <RecordTableSection
        title="Guardians"
        columns={[
          { key: "name", label: "Name" },
          { key: "relationship", label: "Relationship" },
          { key: "status", label: "Status" },
          { key: "responsibilities", label: "Responsibilities" },
        ]}
        rows={student.guardians.map(
          (guardian): RecordTableRow => ({
            id: guardian.id,
            cells: {
              name: guardian.full_name,
              relationship: titleCase(guardian.link.relationship),
              status: guardian.link.is_primary_contact
                ? "Primary"
                : "Secondary",
              responsibilities: getGuardianResponsibility(guardian),
            },
          })
        )}
        onAdd={noop}
        onEditRow={noop}
        onDeleteRow={noop}
        addLabel="Link a guardian"
        requireAtLeastOne={false}
        emptyLabel="No guardians linked yet."
      />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button variant="secondary" size="lg" className="flex-1">
          Suspend user
        </Button>
        <Button size="lg" className="flex-1">
          Disable user account
        </Button>
      </div>

      <button
        type="button"
        className="mx-auto text-[13px] font-medium text-error"
        onClick={() => setDeleteModal(true)}
      >
        Delete user account
      </button>

      {/* Wire your existing FormModal here for delete confirmation */}
      {deleteModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="rounded-ml bg-white p-6 flex flex-col gap-4 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Delete this student account?</span>
            <div className="flex items-center justify-between">
              <Button onClick={() => setDeleteModal(false)}>No</Button>
              <Button
                variant="secondary"
                loading={isDeleting}
                onClick={onDelete}
                className="border-error-200! text-error-200!"
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}