import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GuardianLinkedUser } from "../types/guardian-linked-user-types";

// Confirmed: GET /guardians/{guardian}/linked-user.
export const getGuardianLinkedUser = (
  guardianId: string
): Promise<GuardianLinkedUser> => {
  return api.get(`guardians/${guardianId}/linked-user`);
};

// Nested under ["guardians", guardianId], so invalidating the
// guardian's detail key also refreshes this. After provisioning a
// login, invalidate this key so is_linked flips.
export const useGetGuardianLinkedUser = (guardianId: string) => {
  return useQuery({
    queryKey: ["guardians", guardianId, "linked-user"],
    queryFn: () => getGuardianLinkedUser(guardianId),
    enabled: Boolean(guardianId),
  });
};