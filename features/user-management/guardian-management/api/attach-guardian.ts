import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type {
  AttachGuardianPayload,
  AttachGuardianResponse,
} from "../types/attach-guardian-types";

interface AttachGuardianArgs {
  studentId: string;
  payload: AttachGuardianPayload;
}

// Confirmed: POST /students/{student}/guardians. Note the direction —
// this attaches a guardian TO a student, not the other way round.
// When called from the guardian's own "Link Student" modal, the
// student is whichever one was picked in the dropdown, and
// payload.guardian_id is the current guardian's id — same underlying
// relationship, just the one confirmed direction. The response
// reloads the STUDENT (with its guardians array), not the guardian,
// so callers on the guardian side should invalidate the guardian's
// own query (["guardians", guardianId]) to refresh its `students`
// list, rather than trying to read guardian data out of this result.
export const attachGuardian = ({
  studentId,
  payload,
}: AttachGuardianArgs): Promise<AttachGuardianResponse> => {
  return api.post(`students/${studentId}/guardians`, payload);
};

export const useAttachGuardian = () => {
  return useMutation<
    AttachGuardianResponse,
    ServerErrorResponse,
    AttachGuardianArgs
  >({
    mutationFn: attachGuardian,
  });
};