---
name: create-api
description: Use when adding a backend API caller (TanStack Query service function + hook) under features/**/api, e.g. /create-api with requestType, route, featurePath, apiFileName, responseStructure, requestSchema, raw. Also use for requests like "add a GET/POST/PUT api file", "create an api hook for <route>", "new endpoint caller in <feature>".
---

# Create API

Generates one API file (and its schema/type files when needed) that matches this
repo's existing conventions exactly. The repo's api files are the source of truth;
**read the closest sibling before writing** and mirror it.

## Inputs

| Param               | Required | Meaning                                                         |
| ------------------- | -------- | --------------------------------------------------------------- |
| `requestType`       | yes      | `GET` \| `POST` \| `PUT`                                        |
| `route`             | yes      | Backend route **without** leading `/` and **without** `/api/v1` |
| `featurePath`       | yes      | Feature dir, e.g. `features/academic-year`                      |
| `apiFileName`       | yes      | File name without `.ts`                                         |
| `responseStructure` | yes      | Shape returned by the endpoint                                  |
| `requestSchema`     | POST/PUT | Body/query shape (omit for bodyless GET)                        |
| `typeFileName`      | no       | Defaults to `<apiFileName>-type`                                |
| `schemaFileName`    | no       | Defaults to `<apiFileName>-schema`                              |
| `raw`               | no       | Default `false` → sets `raw` in the `lib/api.ts` call           |

If a required input is missing, ask for it with the `question` tool. Never guess a route.

## Step 1 — Resolve paths

- API file: `<featurePath>/api/<apiFileName>.ts` (create `api/` if absent)
- Schema file: `<featurePath>/schemas/<schemaFileName>.ts` (POST/PUT with `requestSchema`; no `.ts` on the given name)
- Type file: `<featurePath>/types/<typeFileName>.ts` — **but see the type-location rule below**
- Imports in the API file are relative: `../schemas/x`, `../types/api/x`, `./query-keys`

Then read 2–3 existing api files in that same feature (or in `features/academic-year` /
`features/user-management/staff-management`) and match their shape.

## Hard rules

1. **Only create/modify the requested API file and files directly required by it.**
   Do not modify other existing API implementation files.

   `api/query-keys.ts` is an exception: if the feature uses centralized query keys
   and the required key factory does not already exist, add the required key factory
   to `query-keys.ts` and use it in the new API file.

   Do not fall back to an inline query key merely to avoid modifying
   `query-keys.ts`.

2. **Do not invent a new pattern.** If a sibling already covers the shape (paginated
   list, bodyless POST, parent-scoped route), copy that sibling's structure.
3. **Never hand-roll `fetch`/axios in the new file.** Use `api` from `@/lib/api`.
4. **Response typing and `raw` must agree** (see below).
5. **Validation:** `npm run lint` and `npx tsc --noEmit` must pass.

## `lib/api.ts` semantics you must respect

- `api.get/post/put/patch/delete<T>(path, ...)` → `Promise<T>`.
- Route paths are relative to `/api/v1/`. A leading `/` bypasses the prefix
  (e.g. `/sanctum/csrf-cookie`). Never include `/api/v1` in `route`.
- Default (`raw` omitted / `raw: false`) returns **`json.data`** → type the
  function as the unwrapped resource (`Staff[]`, `AcademicYear`, `null`).
- `raw: true` returns the **entire JSON envelope** → type the function as the
  envelope (e.g. `{ data: Staff[]; meta: PaginationMeta }`). Always pair a
  `raw: true` call with an envelope type.
- `{ params }` option serializes a query object; `FormData` bodies bypass
  `Content-Type` and JSON stringification automatically.
- Errors throw `ApiError`; a toast is already fired by the client. Never add
  try/catch or manual error toasts.

## Response type placement (do not duplicate domain models)

Existing domain models live at `<featurePath>/types/api/<domain>.ts`
(e.g. `types/api/staff.ts`, `types/api/academic-year.ts`).

- If the response is an existing domain model → import it, create nothing.
- If the response is a new domain model → create `<featurePath>/types/api/<typeFileName>.ts`.
- If the type is endpoint-specific (params object, envelope wrapper, response
  union) → declare it inline in the API file (see `StaffResponse` /
  `ListStaffParams` in `list-staff.ts`) or in `<featurePath>/types/<typeFileName>.ts`.

## Naming derivations

From `apiFileName` (kebab-case):

| Artifact           | Derivation                        | Example (`create-arm`) |
| ------------------ | --------------------------------- | ---------------------- |
| service function   | camelCase + verb                  | `createArm`            |
| hook               | `use` + PascalCase                | `useCreateArm`         |
| schema const       | camelCase of file name + `Schema` | `createArmSchema`      |
| schema inferred ty | PascalCase + `FormData`           | `CreateArmFormData`    |

- GET: `list-`/`get-` → `listXs` / `getX`; PUT: `update-`/`edit-` → `updateX` / `editX`.
- Import form-data types with `import type` (they are type-only in every existing file).
- Import response/domain types as plain imports, matching siblings.

---

## Templates

### POST — form body

Reference: `features/academic-year/api/create-academic-year.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import type { AcademicYearFormData } from "../schemas/create-academic-year-schema";
import { ServerErrorResponse } from "@/types/api";
import { AcademicYear } from "../types/api/academic-year";

export const createAcademicYear = (
  data: AcademicYearFormData
): Promise<AcademicYear> => {
  return api.post("academic-years", data);
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation<AcademicYear, ServerErrorResponse, AcademicYearFormData>({
    mutationFn: (data) => {
      return createAcademicYear(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
```

### POST — route segment + no body

Reference: `features/academic-year/api/set-year-to-current.ts` (passes `{}`),
`features/user-management/api/validate-mapping.ts` (passes nothing).

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { academicYearKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";

export const setCurrentYear = (yearId: string): Promise<null> => {
  return api.post(`academic-years/${yearId}/set-current`, {});
};

export const useSetCurrentYear = (yearId: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, {}>({
    mutationFn: () => setCurrentYear(yearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
};
```

Mirror whichever sibling shape the endpoint matches. Return `Promise<null>` when
the endpoint has no body. Path params come from the route via template literals.

### POST — parent-scoped route + body

Reference: `features/academic-year/api/create-arm.ts`

```ts
export const createArm = (
  data: CreateArmFormData,
  level: string
): Promise<null> => {
  return api.post(`education/levels/${level}/sections`, data);
};

export const useCreateArm = (level: string) => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, CreateArmFormData>({
    mutationFn: (data) => {
      return createArm(data, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: armKeys.detail(level) });
    },
  });
};
```

### POST — FormData / file upload

Reference: `features/user-management/api/start-import.ts`. Build `FormData`,
pass it as the body; `lib/api.ts` sets headers automatically.

```ts
const formData = new FormData();
formData.append("file", data.file);
return api.post("imports", formData);
```

### PUT

Reference: `features/academic-year/api/update-academic-year.ts`,
`features/user-management/staff-management/api/edit-staff.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { staffKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { Staff } from "../types/api/staff";
import { EditStaffFormData } from "../schemas/edit-staff-schema";

type EditStaffVariables = {
  id: string;
  data: EditStaffFormData;
};

export const editStaff = ({ id, data }: EditStaffVariables): Promise<Staff> => {
  return api.put(`staff/${id}`, data);
};

export const useEditStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<Staff, ServerErrorResponse, EditStaffVariables>({
    mutationFn: (variables) => {
      return editStaff(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};
```

The variables object is declared **locally** in the api file. Use it whenever the
route needs the resource id. Add extra path params to it (see `UpdateArmVariables`).

### GET — collection, no params

Reference: `features/academic-year/api/list-levels.ts` (the file is `list-levels.ts`, not `list-level.ts`)

```ts
import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { levelKeys } from "./query-keys";
import { EducationLevel } from "../types/api/levels";

export const listLevels = (): Promise<EducationLevel[]> =>
  api.get("education/levels");

export const useListLevels = (
  options?: Partial<UseQueryOptions<EducationLevel[], ServerErrorResponse>>
) => {
  return useQuery<EducationLevel[], ServerErrorResponse>({
    queryFn: listLevels,
    queryKey: levelKeys.all,
    ...options,
  });
};
```

### GET — single resource

Reference: `features/user-management/staff-management/api/get-staff.ts`

```ts
export const getStaff = (id: string): Promise<Staff> => {
  return api.get(`staff/${id}`);
};

export const useGetStaff = (
  id: string,
  options?: Partial<UseQueryOptions<Staff, ServerErrorResponse>>
) => {
  return useQuery<Staff, ServerErrorResponse>({
    queryFn: () => getStaff(id),
    queryKey: staffKeys.detail(id),
    ...options,
  });
};
```

### GET — nested route (parent id)

Reference: `features/academic-year/api/list-arms.ts`, `list-level-overview.ts`

```ts
export const listArms = (level: string): Promise<EducationArm[]> =>
  api.get(`education/levels/${level}/sections`);

export const useListArms = (
  level: string,
  options?: Partial<UseQueryOptions<EducationArm[], ServerErrorResponse>>
) => {
  return useQuery<EducationArm[], ServerErrorResponse>({
    queryFn: () => listArms(level),
    queryKey: armKeys.detail(level),
    ...options,
  });
};
```

### GET — paginated list, `raw: true`

Reference: `features/user-management/staff-management/api/list-staff.ts`

```ts
interface StaffResponse {
  data: Staff[];
  meta: PaginationMeta;
}

export type ListStaffParams = {
  search?: string;
  page?: number;
  [key: string]: string | number | undefined;
};

export const listStaff = (params?: ListStaffParams): Promise<StaffResponse> => {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }
  const query = searchParams.toString();
  return api.get(`staff${query ? `?${query}` : ""}`, { raw: true });
};

export const useListStaff = (
  params?: ListStaffParams,
  options?: Partial<UseQueryOptions<StaffResponse, ServerErrorResponse>>
) => {
  return useQuery<StaffResponse, ServerErrorResponse>({
    queryFn: () => listStaff(params),
    queryKey: params?.search
      ? staffKeys.filtered(params.search, params.page)
      : params?.page !== undefined
      ? staffKeys.byPage(params.page)
      : staffKeys.all,
    ...options,
  });
};
```

`PaginationMeta` comes from `@/types/api`. Every list query key **must** include
the params (or use a `filtered`/`byPage` factory) so different filters don't
collide in the cache.

### GET — simple query object

Reference: `features/user-management/student-management/api/get-enrolment.ts`.
Use when the endpoint takes a fixed, small param set (no pagination envelope).

```ts
export const getEnrolments = (
  params: GetEnrolmentsParams
): Promise<GetEnrolmentsResponse> => {
  return api.get("enrolments", { params });
};

export const useGetEnrolments = (params: GetEnrolmentsParams) => {
  return useQuery({
    queryKey: ["enrolments", params],
    queryFn: () => getEnrolments(params),
  });
};
```

### GET — single optional param

Reference: `features/academic-year/api/list-subjects.ts`

```ts
export const listSubjects = (department?: string): Promise<Subject[]> => {
  const queryKey = department ? `?department=${department}` : "";
  return api.get(`subjects${queryKey}`);
};
```

### GET — `raw: true`, bare payload

Reference: `features/user-management/api/get-count.ts` — endpoint returns a bare
object (no `data` key), so `raw: true` is required and the type is that object.

```ts
return api.get("people/count", { raw: true });
```

---

## Schema file template

Path: `<featurePath>/schemas/<apiFileName>-schema.ts`
Reference: `features/academic-year/schemas/create-academic-year-schema.ts`

```ts
import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createArmSchema = z.object({
  name: requiredString,
  starts_on: z.iso.datetime("Please enter a valid date"),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateArmFormData = z.infer<typeof createArmSchema>;
```

Conventions:

- Zod v4 (`zod@^4`): use `z.iso.datetime(...)`, `z.iso.date(...)`.
- Prefer shared field builders from `@/lib/utils/zod-schemas`
  (`requiredString`, `emailString`, `phoneString`, `hexColorString`).
- Every schema exports a `*Schema` const **and** an inferred `*FormData` type.
- Human-readable messages in the string arg; field-specific `path` in `.refine()`.
- Field names match the backend payload (`snake_case`), not the UI label.
- For PUT, derive from the POST schema when the endpoint is a full update
  (see `edit-staff-schema.ts` spreading `.partial().shape`).

## Type file template

Path: `<featurePath>/types/<typeFileName>.ts` (or `types/api/<typeFileName>.ts`)

```ts
export type Arm = {
  id: string;
  school_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};
```

Use `string` for ids/timestamps unless the feature already imports `ISODateString`
from `@/types/api`.

## Query keys

- Reuse an existing factory from `<featurePath>/api/query-keys.ts`
  (`xxxKeys.all`, `xxxKeys.detail(id)`, `xxxKeys.filtered(...)`).
- Shape: `export const xxxKeys = { all: ["xxx"] as const, detail: (id: string) => ["xxx", id] as const };`
- Reuse an existing factory from `<featurePath>/api/query-keys.ts`
  (`xxxKeys.all`, `xxxKeys.detail(id)`, `xxxKeys.filtered(...)`).
- If the feature uses centralized query keys but no suitable factory exists,
  add the required factory to `query-keys.ts`.
- Do not use an inline array query key when the feature uses centralized
  `query-keys.ts`.
- If the feature does not use centralized query keys, follow the existing
  inline query-key pattern used by that feature.
- Shape:
  `export const xxxKeys = { all: ["xxx"] as const, detail: (id: string) => ["xxx", id] as const };`

## Checklist before finishing

- [ ] `route` has no leading `/` and no `/api/v1`
- [ ] Return type matches `raw` (unwrapped vs envelope)
- [ ] Only the requested API file and directly required supporting files were modified
- [ ] `query-keys.ts` was modified only if a required centralized query-key factory was missing
- [ ] Schema/type files in `schemas/` and `types/`, default `-schema` / `-type` names
- [ ] `useMutation` third generic present for POST/PUT; error type `ServerErrorResponse`
- [ ] GET hook accepts `options?: Partial<UseQueryOptions<...>>` and spreads it last
- [ ] List query keys include params
- [ ] `onSuccess` invalidates the affected `xxxKeys.*`
- [ ] No try/catch, no manual toast, no direct fetch
- [ ] `npm run lint` and `npx tsc --noEmit` pass

## Worked example

`/create-api requestType: POST, route: academic-years, featurePath: features/academic-year,
apiFileName: create-academic-year, responseStructure: AcademicYear,
requestSchema: { name, starts_on, ends_on, terms[] }`

→ Writes `features/academic-year/api/create-academic-year.ts` (template above) and
`features/academic-year/schemas/create-academic-year-schema.ts`. The `AcademicYear`
model already exists at `types/api/academic-year.ts` and `academicYearKeys` already
exists in `api/query-keys.ts`, so neither is created or modified.
