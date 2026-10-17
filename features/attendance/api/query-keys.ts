// Query keys for attendance. Add new endpoints' keys here as they're
// built; invalidating `all` refreshes everything attendance-related.
export const attendanceKeys = {
  all: ["attendance"] as const,
  statuses: () => [...attendanceKeys.all, "statuses"] as const,
  rules: () => [...attendanceKeys.all, "rules"] as const,
  // Prefix for every register query of every section and term.
  registers: () => [...attendanceKeys.all, "register"] as const,
  // Prefix for one section + term. Mark-register invalidates this,
  // which covers each date/type below it.
  register: (sectionId: string, termId: string) =>
    [...attendanceKeys.registers(), sectionId, termId] as const,
  // The class summary is derived from the register, so it lives under
  // the same section + term prefix: marking a register (or approving an
  // absence) invalidates it too, with no change to those hooks.
  classSummary: (sectionId: string, termId: string) =>
    [...attendanceKeys.register(sectionId, termId), "summary"] as const,
  // Prefix for every single-student summary.
  enrolmentSummaries: () => [...attendanceKeys.all, "enrolment"] as const,
  enrolmentSummary: (
    enrolmentId: string,
    termId: string,
    params: { from?: string; to?: string } = {}
  ) =>
    [
      ...attendanceKeys.enrolmentSummaries(),
      enrolmentId,
      termId,
      params,
    ] as const,
  registerSession: (
    sectionId: string,
    termId: string,
    params: { date?: string; type?: string } = {}
  ) => [...attendanceKeys.register(sectionId, termId), params] as const,
};