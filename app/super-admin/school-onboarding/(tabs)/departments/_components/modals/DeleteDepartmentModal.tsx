"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { CloseSquare, InfoCircle, Trash } from "iconsax-reactjs";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { useDeactivateDepartment } from "@/features/departments/api/deactivate-department";
import { useDeleteDepartment } from "@/features/departments/api/delete-department";
import { Department } from "@/types";
import ReassignDepartmentModal from "./ReassignDepartmentModal";

interface DeleteDepartmentModalProps {
  // The department being deleted; the modal is open while this is set.
  department: Department | undefined;
  onClose: () => void;
  // Called after a successful delete, so the detail modal can close too.
  onDeleted?: () => void;
}

const PILL =
  "flex h-12 flex-1 items-center justify-center rounded-[28px] px-6 text-[16px] font-normal leading-[1.2] disabled:cursor-not-allowed disabled:opacity-60";

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/**
 * Delete a department, with two states keyed on its status:
 *
 *  - ACTIVE: a department in use is never deleted outright, so this
 *    explains why and offers Deactivate, Reassign members (which opens
 *    the reassign modal) or Cancel.
 *  - DEACTIVATED: a plain "are you sure?" confirmation.
 *
 * Deactivate, reassign and delete are all wired to the API.
 */
export default function DeleteDepartmentModal({
  department,
  onClose,
  onDeleted,
}: DeleteDepartmentModalProps) {
  const [reassigning, setReassigning] = useState(false);
  const { mutate: deactivate, isPending: isDeactivating } =
    useDeactivateDepartment();
  const { mutate: remove, isPending: isDeleting } = useDeleteDepartment();

  const isActive = department?.is_active ?? false;

  function handleDeactivate() {
    if (!department) return;

    deactivate(department.id, {
      onSuccess: () => {
        toast.success("Department deactivated");
        onClose();
      },
    });
  }

  function handleDelete() {
    if (!department) return;

    remove(department.id, {
      onSuccess: () => {
        toast.success("Department deleted");
        onDeleted?.();
        onClose();
      },
    });
  }

  // ------- deactivated: confirm -------
  if (department && !isActive) {
    return (
      <DialogPrimitive.Root
        open
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
            <DialogPrimitive.Popup className="relative my-auto flex w-full max-w-[440px] shrink-0 flex-col items-center gap-6 rounded-[16px] bg-white p-6 text-center outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
              <DialogPrimitive.Close className="absolute right-2 top-2 sm:-right-5 sm:-top-5">
                <CloseSquare size={24} variant="Bulk" color="#433E3F" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>

              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEC]">
                <Trash size={28} variant="Bulk" color="#2B2350" />
              </span>

              <div className="flex flex-col gap-2">
                <DialogPrimitive.Title className="text-[18px] font-semibold text-neutrals-900">
                  Delete {department.name}
                </DialogPrimitive.Title>
                <p className="text-[14px] text-neutrals-700">
                  You are about to delete {department.name}, do you want to
                  proceed with this action.
                </p>
              </div>

              <div className="flex w-full gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`${PILL} border border-primary bg-base-white text-primary`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`${PILL} bg-[#8C1823] text-white`}
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </DialogPrimitive.Popup>
          </div>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  // ------- active: can't delete -------
  return (
    <FormModal
      open={!!department}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      maxWidth="max-w-[480px]"
      title={
        <span className="flex flex-col items-start gap-1">
          <span className="text-[20px]">Can’t delete {department?.name}</span>
          <span className="text-[14px] font-normal text-neutrals-700">
            A department in use is never deleted outright
          </span>
        </span>
      }
    >
      {department && (
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-start gap-3 rounded-[8px] bg-[#FDECEC] p-3 text-[14px] text-[#D64545]">
            <InfoCircle
              size={18}
              variant="Bulk"
              color="#D64545"
              className="mt-0.5 shrink-0"
            />
            <p>
              This department is still used by{" "}
              {plural(department.subjects_count, "subject", "subjects")} and{" "}
              {plural(
                department.staff_count,
                "staff member",
                "staff members"
              )}
              . Move them to another department (or unset) first, or retire this
              one instead.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={isDeactivating}
              className={`${PILL} border border-primary bg-base-white text-primary`}
            >
              {isDeactivating ? "Deactivating…" : "Deactivate"}
            </button>
            <button
              type="button"
              onClick={() => setReassigning(true)}
              className={`${PILL} bg-primary text-white`}
            >
              Reassign members
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mx-auto text-[16px] font-normal text-primary"
          >
            Cancel
          </button>

          {/* Nested inside this dialog so clicks in the reassign modal
              don't count as outside clicks here. */}
          <ReassignDepartmentModal
            department={reassigning ? department : undefined}
            onClose={() => setReassigning(false)}
          />
        </div>
      )}
    </FormModal>
  );
}
