# Contributing Guide

Welcome to the **Skoolpro Frontend** team! This document outlines the coding standards every contributor is expected to follow. It complements [architecture.md](./architecture.md), which explains _how_ the app is structured — this guide focuses on _how to write code_ so it stays consistent, readable, and maintainable.

The project follows **[bulletproof-react](https://github.com/alan2207/bulletproof-react)** principles on top of **Next.js 16 (App Router) + React 19**, with feature-first domain isolation.

---

## 1. Naming Conventions

### File names

All file names must be **kebab-case**:

```
features/auth/api/login.ts
features/auth/schemas/login-form-schema.ts
app/(auth)/login/_components/login-form.tsx
```

### Types

Types, interfaces, enums, and type aliases must be **TitleCase (PascalCase)**:

```ts
type LoginResponse = { ... };        // ✅
interface SchoolProfile { ... };     // ✅

type loginResponse = { ... };        // ❌
interface school_profile { ... };    // ❌
```

Variables, functions, and hooks use `camelCase`; React components use `PascalCase`.

---

## 2. Feature Isolation (No Cross-Feature Imports)

Features are self-contained domains under `/features/`. **A feature or module must never import from another feature or module.**

```
features/auth/...   →   features/onboarding/...   ❌ FORBIDDEN
```

If something genuinely needs to be consumed by more than one feature, it does not belong inside either feature — move it to a **`shared`** location:

- `shared/` folder (for cross-feature logic, types, schemas, constants)
- `components/` (global reusable UI)
- `lib/` (global helpers and configurations)
- `types/` (global type declarations)

Rule of thumb: _if you find yourself reaching across features, promote the code up into `shared` instead._

---

## 3. Constants Live in Their Own Files

Never inline large constant objects/arrays inside business logic files. It clutters the logic and makes both harder to read.

```
lib/utils/countries_list.ts
lib/utils/school_type_list.ts
features/<feature>/constants/<constant_name>.ts
```

```ts
// features/onboarding/constants/school_stages.ts
export const SCHOOL_STAGES = ["Primary", "Secondary", "Combined"] as const;
```

Then import them where needed. Keep business logic files focused on logic.

---

## 4. Component Decomposition & Minimal Pages

Follow Next.js standards and basic readability: break things into components instead of writing one giant wall of JSX/logic in a single file.

### `page.tsx` files must stay minimal

A `page.tsx` is an entry point only — routing metadata and composition, nothing else. All real content lives in co-located route-specific components under `_components/`:

```tsx
// app/(auth)/login/page.tsx
import LoginForm from "./_components/login_form";

const Login = () => {
  return <LoginForm />;
};

export default Login;
```

Guidelines:

- Complex sections (forms, tables, hero sections, modals) → their own component file.
- Route-specific components → `app/route/_components/` (the underscore keeps them private to the route).
- Reusable across routes → `components/`.
- If a component file grows beyond roughly 200–300 lines, look for parts to extract.

---

## 5. Server Components First, Client Components Singled Out

Default to **server components**. Only mark a component `"use client"` when it actually needs browser APIs, state, event handlers, or React hooks.

If only a fraction of a page needs client-side behavior (e.g., an input that toggles password visibility, an online/offline detector), extract **that fraction** into its own small client component and keep the rest of the page as a server component:

```
app/dashboard/page.tsx            ← server component (default)
app/dashboard/_components/stats_table.tsx   ← server
app/dashboard/_components/filter_bar.tsx    ← "use client" (needs interactivity)
```

Do not sprinkle `"use client"` at the top of pages just because one widget inside needs it — that forces the whole tree down the client bundle.

---

## 6. Write Re-render-Safe Code

Prevent unnecessary re-renders. Common offenders:

### Don't mirror props/state into state via `useEffect`

```tsx
// ❌ Extra render pass on every change
const [name, setName] = useState(user.name);
useEffect(() => {
  setName(user.name);
}, [user.name]);

// ✅ Derive during render
const name = user.name;
```

If you need local editable state initialized once, use a lazy initializer or a `key` to reset, not a syncing effect.

Other practices:

- Memoize expensive computations with `useMemo` when inputs are stable.
- Stabilize callback identities passed to memoized children (`useCallback`) rather than re-creating functions every render.
- Lift state only as high as necessary; colocate state as low as possible.
- Let React Query own server state — don't copy query results into `useState`.
- Never call Axios/fetch directly inside a component body. Always go through TanStack Query hooks defined in the feature's `api/` folder.

---

## 7. Use the Design System Components

Per the Figma style guide, **every UI element already exists as a custom component**. Do not build new buttons/inputs/etc., and do not pull raw HTML elements or third-party widget libraries unless the element genuinely doesn't exist yet. Check this list first:

> Note: some legacy files still use kebab-case/PascalCase names — use their current paths below until they're renamed, but **new** files must follow the snake_case rule.

| Component           | Location                                         | Notes                                                 |
| :------------------ | :----------------------------------------------- | :---------------------------------------------------- |
| `Button`            | `components/ui/custom-button/button.tsx`         | CVA variants, built-in loading state                  |
| `IconButton`        | `components/ui/custom-button/iconButton.tsx`     | Icon-only button                                      |
| `Input`             | `components/ui/form/input/input.tsx`             | Floating label, password toggle, error states, loader |
| `Select`            | `components/ui/form/select/select.tsx`           |                                                       |
| `TextArea`          | `components/ui/form/textarea/text-area.tsx`      |                                                       |
| `Checkbox`          | `components/ui/form/checkbox/checkbox.tsx`       |                                                       |
| `DatePicker`        | `components/ui/form/date-picker/date-picker.tsx` |                                                       |
| `DragNDrop`         | `components/ui/form/drag-n-drop/drag-n-drop.tsx` | File upload via react-dropzone                        |
| `OTP`               | `components/ui/custom-otp-input.tsx`             | One-time-code input                                   |
| `Text`              | `components/ui/text/text.tsx`                    | Typography wrapper — use instead of raw headings      |
| `SuccessModal`      | `components/common/successModal/modal.tsx`       | Standard transaction-success feedback dialog          |
| `Spinner`           | `components/animations/spinner/spinner.tsx`      | Lottie loading indicator                              |
| Brand logos & icons | `components/icons/`                              | Skoolpro logos, icon wrapper                          |

Form atoms are re-exported from `components/ui/form/index.ts`, and `Button` / `IconButton` from `components/ui/custom-button/index.ts`.

Form components integrate directly with React Hook Form through `<FormProvider>` (see architecture.md §9):

```tsx
<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <Input name="email" label="Enter email" type="email" />
    <Button loading={isPending}>Submit</Button>
  </form>
</FormProvider>
```

If you need a primitive that doesn't exist (dialog, popover, alert, calendar, separator…), base building blocks live under `components/ui/` — extend from those rather than adding a new dependency.

Styling: use Tailwind v4 design tokens from `app/globals.css` (`bg-primary`, `p-sm`, `rounded-lg`, …). Never hardcode hex colors or pixel values.

---

## 8. Before You Open a PR

Run both of these and fix all errors/warnings:

```bash
npm run lint
npm run build
```

Checklist:

- [ ] Files are `kebab-case`; types are TitleCase
- [ ] No imports between features; shared code promoted to `shared`/global layers
- [ ] Constants extracted to dedicated files
- [ ] `page.tsx` is minimal; logic decomposed into `_components/`
- [ ] Client components kept as small and isolated as possible
- [ ] No re-render hazards (state-syncing effects, unstable callbacks)
- [ ] Only design-system components used; tokens used for styling
- [ ] API calls wrapped in React Query hooks in the feature's `api/` folder

When in doubt, look at an existing feature (e.g., `features/auth/` or the login route) and mirror its structure.
