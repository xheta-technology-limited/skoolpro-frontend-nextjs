import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { templateKeys } from "./query-keys";

type Entity = "staff" | "student" | "guardian";
export const getTemplate = (entity: Entity): Promise<Blob> => {
  return api.get(`imports/template/${entity}`, {
    raw: true,
    responseType: "blob",
  });
};
export const useGetTemplate = (
  entity: Entity,
  options?: Partial<UseQueryOptions<Blob, ServerErrorResponse>>
) => {
  return useQuery<Blob, ServerErrorResponse>({
    queryFn: () => getTemplate(entity),
    queryKey: templateKeys.detail(entity),
    ...options,
  });
};
