import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { templateKeys } from "./query-keys";

type Entity = "staff" | "student" | "guardian";
export const getTemplate = (entity: Entity): Promise<null> =>
  api.get(`imports/template/${entity}`);

export const useGetTemplate = (
  entity: Entity,
  options?: Partial<UseQueryOptions<null, ServerErrorResponse>>
) => {
  return useQuery<null, ServerErrorResponse>({
    queryFn: () => getTemplate(entity),
    queryKey: templateKeys.detail(entity),
    ...options,
  });
};
