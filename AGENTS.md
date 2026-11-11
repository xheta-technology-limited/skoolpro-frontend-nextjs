<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Skoolpro frontend

Next.js 16 App Router + React 19 + TypeScript. Use npm (`package-lock.json`). There is no test runner, CI, pre-commit hook, or formatter configured.

## Source of truth

- `architecture.md` — directory map and data flow.
- `contributing.md` — coding standards; read before adding features/UI.
- `lib/api.ts` and neighbouring feature files override stale prose. For example, `architecture.md` still says Axios and mentions an `OfflineBanner` that `app/providers.tsx` no longer renders; the real client is a `fetch` wrapper.
- `.opencode/skill/create-api/SKILL.md` — exact pattern for new API files. Load the `create-api` skill when adding endpoints.
- `README.md` is the untouched `create-next-app` boilerplate; ignore it.

## Commands

```bash
npm run dev        # next dev
npm run lint       # eslint (no auto-fix)
npx tsc --noEmit   # TypeScript check; no typecheck script exists
npm run build      # next build; also regenerates .next/types
```

Before finishing: `npm run lint` → `npx tsc --noEmit` → `npm run build`. Next 16's `next build` does not run ESLint, so lint separately. Focus a lint run with `npx eslint <path>`. The repo has pre-existing lint errors/warnings, so avoid mass-fixing unrelated files. This is a single-package repo with no test command; Testing Library packages are installed but unused with no runner config.

## Structure

- `app/` is routing only. Keep `page.tsx` as an entry point; route-specific components go in private `_components/` folders. `(group)` folders are route groups, not URLs.
- `features/<domain>/` owns `api/` (service functions + TanStack Query hooks), `schemas/` (Zod), `types/` (usually `types/api/`), and Zustand `*.store.ts` files.
- Keep feature boundaries: features must not import each other (one legacy `subscriptions` → `onboarding` import exists; don't copy it). Promote shared code to `components/`, `lib/`, `types/`, `config/`, or `hooks/`. `contributing.md` mentions `shared/`, but that folder does not exist.
- `components/ui/` is the design system, `components/common/` holds composites, `config/` holds global constants/navigation, and `hooks/` holds cross-feature hooks.
- No `src/` directory. The `@/*` alias maps to the repository root.

## API + data fetching (most common mistake)

- Always use `api` from `@/lib/api` through TanStack Query hooks under `features/**/api`. Never call `fetch`/axios directly in components.
- Routes are relative to `/api/v1/` — omit the leading `/` and never include `/api/v1`. A leading `/` bypasses the prefix; use it only for `/sanctum/...`.
- Default calls return `json.data`; use `{ raw: true }` plus an envelope type for paginated responses (`{ data, meta }`).
- `lib/api.ts` toasts non-401 HTTP errors and redirects to `/login` on 401. Network (`fetch` rejection) and JSON-parse failures are thrown without a toast, so callers may add their own recovery feedback for those. For errors the client already handles, do not add try/catch or manual toasts; consume the thrown `ApiError`.
- Login must call `getCsrfCookie()` (`/sanctum/csrf-cookie`) before submitting credentials; see `features/auth/api/login.ts`.
- Reuse `features/*/api/query-keys.ts` factories; include params in list keys and invalidate affected keys in `onSuccess`. Match a sibling if a feature uses inline keys instead.

## UI conventions

- Prefer the custom design system: `Button`/`IconButton` from `@/components/ui/custom-button`, form atoms from `@/components/ui/form`, `Text` from `@/components/ui/text`, and shared modals from `@/components/common`. Raw shadcn primitives exist, but new UI should use the custom components.
- Tailwind v4 tokens live in `app/globals.css` (`@theme inline`). Use token classes (`bg-primary`, `bg-primary-bg`, `text-neutrals-900`, `p-sm`), not hardcoded hex/pixel values.
- Forms: React Hook Form `<FormProvider>` + a Zod schema from the feature's `schemas/`. Custom inputs register via `name`.
- Server components are the default, but much of this app is client-side. Add `"use client"` to the interactive leaf, not the whole page tree.

## Naming / code style

- New files: kebab-case. Types/interfaces/enums: PascalCase. Variables/functions: camelCase. Components: PascalCase.
- Existing files are inconsistent (PascalCase in `_components`, camelCase helpers); mirror the nearest sibling rather than renaming.
- Keep large constant objects in `constants.ts` or `lib/utils/`, not inside business logic.
- API payload fields are snake_case (backend schema), even when UI code is camelCase.
- Zustand stores call `registerStoreReset(...)` from `@/lib/store-registry` so logout/reset clears persisted state.

## Environment / backend

- Copy `.env.example`, but only `BACKEND_API_URL` is currently read (server-side, in `lib/api.ts`); it must be an absolute backend origin because server requests resolve against it. The `NEXT_PUBLIC_*` keys there are unused. Browser requests are same-origin.
- `next.config.ts` rewrites `/api/v1/*` and `/sanctum/*` to `https://api.skoolpro.net`. Remote images allow `picsum.photos` and `api.skoolpro.net`.
- `output: "standalone"` and `cacheComponents: true` are enabled. Check bundled Next 16 docs before adding cache directives or assuming old caching behaviour.
- No middleware or route guard exists; protection relies on API 401 redirects.

## Workflow

- `.coderabbit.yaml` auto-reviews PRs targeting `dev`. There is no CI, so local lint/tsc/build is the quality gate.
