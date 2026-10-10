import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type { GetStudentGuardiansResponse } from "../types/get-student-guardians-types";
import type { UpdateGuardianLinkPayload } from "../types/update-guardian-links-types";

interface UpdateGuardianLinkArgs {
  studentId: string;
  guardianId: string;
  payload: UpdateGuardianLinkPayload;
}

// Confirmed: PUT /students/{student}/guardians/{guardian}. Doesn't
// touch is_primary_contact — see update-guardian-link-types.ts and
// set-primary-contact.ts for that.
//
// Response shape is UNCONFIRMED — the spec shows "200" with no
// example body at all. Typed as GetStudentGuardiansResponse (student
// with guardians reloaded) as an assumption, based on how every
// sibling endpoint in this family (attach, set-primary) returns the
// student with guardians reloaded. Verify against a real response
// before relying on anything read off the result.
export const updateGuardianLink = ({
  studentId,
  guardianId,
  payload,
}: UpdateGuardianLinkArgs): Promise<GetStudentGuardiansResponse> => {
  return api.put(`students/${studentId}/guardians/${guardianId}`, payload);
};

export const useUpdateGuardianLink = () => {
  return useMutation<
    GetStudentGuardiansResponse,
    ServerErrorResponse,
    UpdateGuardianLinkArgs
  >({
    mutationFn: updateGuardianLink,
  });
};