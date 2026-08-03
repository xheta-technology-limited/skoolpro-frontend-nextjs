# Skoolpro Frontend Architecture Guide

This document defines the software architecture, design patterns, directory conventions, styling standards, and data flows of the **Skoolpro Frontend** web application. It acts as the single source of truth for developers to understand how code is structured and how features should be built.

---

## 1. Core Architectural Principles

The application is built on **Next.js 16 (App Router)** and **React 19**, adopting a modern, decoupled architecture designed for performance, maintainability, and scale. The system is governed by four primary principles:

1. **Feature-First Domain Isolation:** All domain-specific business logic (API callers, React Query hooks, Zod schemas, and TypeScript interfaces) is encapsulated inside the `/features/` folder.
2. **Atomic & Reusable Presentation UI:** Core styling and reusable UI components are isolated from business logic. They live inside the `/components/` library as stateless or highly localized state-carrying units.
3. **App Router Route Co-Location:** The `/app/` folder is reserved strictly for Next.js file-system routing. Routes should contain entry point files and co-located, route-specific components (prefixed with an underscore like `_components/`).
4. **Theme-First Styling via Tailwind CSS v4:** Legacy configurations like `tailwind.config.js` are replaced by Tailwind CSS v4. The complete styling system, custom spacing, typography maps, transitions, and dynamic colors are declared directly in CSS using `@theme` syntax inside `app/globals.css`.

---

## 2. Technology Stack & Key Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 + React 19 | Standard React SSR, CSR, App Router, and static rendering optimization. |
| **Language** | TypeScript | Strong typing across files, schemas, and API limits. |
| **Styling Engine**| Tailwind CSS v4 | Class-based style compilation and unified token mapping. |
| **Dynamic Styles**| `cva` + `clsx` + `tailwind-merge` | Standardized, type-safe custom variant builders and clean CSS class mergers. |
| **Network Client**| Axios | Promised-based HTTP network communications. |
| **Server State** | TanStack Query v5 (React Query) | State caching, optimistic updates, background refetching, and query synchronization. |
| **Form Handling** | React Hook Form | High-performance form state compilation with context-based nesting. |
| **Validation** | Zod | Declarative, run-time schema validations and type inferencing. |
| **UI Primitives** | `@base-ui/react` | Headless, highly accessible UI block primitives. |
| **Notifications** | Sonner | Rich, customized toast alerts. |
| **Animations** | `@lottiefiles/dotlottie-react` | Ultra-fast vector-based Lottie loading sequences. |
| **Icon Packs** | Phosphor, Tabler, Iconsax | Comprehensive custom and vector-based action icons. |

---

## 3. Directory Structure Map

```text
/
├── app/                             # Next.js App Router (Routing, Shell, & Layouts)
│   ├── (auth)/                      # Auth route group (login, reset password, update password)
│   │   ├── login/
│   │   │   ├── page.tsx             # Login entry point
│   │   │   └── _components/         # Route-specific private components (e.g. LoginForm.tsx)
│   │   ├── reset-password/
│   │   └── update-password/
│   ├── _components/                 # Global page-specific parts (e.g. Navbar, Hero, Services)
│   ├── favicon.ico
│   ├── globals.css                  # Core CSS, imports, and Tailwind v4 Theme Tokens
│   ├── layout.tsx                   # Main HTML structure, fonts, and base shell
│   ├── page.tsx                     # Landing home page
│   └── providers.tsx                # Client Providers (TanStack Query, Toaster, OfflineBanner)
│
├── features/                        # Domain-Driven Core Modules
│   └── auth/                        # "auth" Feature Scope
│       ├── api/                     # Feature API functions and React Query hooks
│       │   ├── login.ts
│       │   └── query-keys.ts        # Structured React Query caching keys
│       ├── schemas/                 # Form-specific Zod schema definitions
│       │   └── login-form-schema.ts
│       └── types/                   # API contracts, requests, and domain types
│           ├── api.ts
│           └── types.ts
│
├── components/                      # Global Reusable Component Library
│   ├── index.ts                     # Single index export entry point
│   ├── animations/                  # Shared lottie animations & loading interfaces
│   │   └── spinner/                 # Dedicated spinner module
│   ├── common/                      # Reusable functional wrappers & complex components
│   │   ├── metric-card.tsx
│   │   ├── offline-banner.tsx       # Live browser online/offline detector banner
│   │   └── successModal/            # Transactional completion modal dialog
│   ├── icons/                       # SVG icon components & corporate branding SVGs
│   │   └── logos/                   # Primary corporate SVGs
│   └── ui/                          # Standard presentation primitives (Design System)
│       ├── alert.tsx
│       ├── sonner.tsx               # Toast configuration module
│       ├── button/                  # CVA-driven Button variant component
│       ├── form/                    # Form components
│       │   ├── input/               # Floating-label validation inputs
│       │   ├── select/
│       │   └── textarea/
│       └── text/                    # Global Typography wrapper
│
├── lib/                             # Global Core Configurations & Base Helpers
│   ├── api.ts                       # Custom Axios instances, interceptors, and error handlers
│   └── utils.ts                     # Layout helpers (e.g. "cn" class merger utility)
│
├── styles/                          # Shared Variant Presets & Layout Definitions
│   ├── index.ts
│   └── link.ts                      # CVA definition for interactive text links
│
└── public/                          # Static Assets (Images, illustrations, local lottie files)
```

---

## 4. Domain & Feature Architecture (`/features`)

Business domains are separated inside the `/features/` directory. Each feature encapsulates all its functional logic, ensuring that the main `/app/` pages remain completely declarative and free of side-effects.

A typical feature directory (e.g., `features/auth/`) is structured as:

1. **`api/` (Data Access Layer):**
   - **Service Layer:** Raw API functions executing Axios requests to backend routes.
   - **Query Layer:** Reusable React Query hooks (`useQuery` and `useMutation`).
   - **Query Keys:** Static, hierarchical indexing schemes (`query-keys.ts`) for query caching control.
2. **`schemas/` (Data Integrity Layer):**
   - Zod validation schemas matching exact requirements of UI inputs. These schemas are also compiled into TypeScript types dynamically via Zod's `infer` utilities.
3. **`types/` (TypeScript Domain Interfaces):**
   - Pure type declarations separating Request bodies, Response formats, and shared domain models.

---

## 5. Client Routing & App Router Organization (`/app`)

The `/app/` directory governs URL mappings using standard Next.js App Router folders.

* **Route Groups:** Dynamic URL directories are categorized using parentheses `(auth)/` to provide semantic code organization without introducing clutter to the public browser paths.
* **Component Co-location:** Large components specific to single pages are co-located within that directory inside a private folder prefixed with an underscore (e.g., `app/(auth)/login/_components/LoginForm.tsx`). This avoids polluting the global `/components/` folder with code that is only needed once.
* **Root Providers (`app/providers.tsx`):**
  A client-side layout element hosting the centralized state managers:
  - `<QueryClientProvider>` (TanStack Server State context).
  - `<Toaster>` (Toast alert node).
  - `<OfflineBanner>` (Web connectivity detector).

---

## 6. Shared Component Library Design (`/components`)

Components placed inside `/components/` are entirely reusable and are organized strictly into four structural tiers:

1. **`ui/` (Presentation Atoms):**
   - Basic elements (Buttons, Inputs, Textareas, Typography labels).
   - Driven by `class-variance-authority` (CVA) to manage states (hover, active, disabled) and sizing configurations via highly predictable types.
2. **`common/` (Composite Molecules):**
   - Complex presentation widgets built by compounding multiple `ui/` atoms.
   - Examples: `offline-banner.tsx` (listens to browser window event bindings to render visual indicators during connection failures) and `successModal/` (standard feedback modal with confirmation steps).
3. **`animations/` & `icons/` (Assets as React Components):**
   - Raw animations or SVG configurations exported as inline TSX assets.
   - Examples: Vector logos (`SkoolproAdmiralBlue_11`), spinners, and brand layouts.

---

## 7. Styling, Themes, & Tokens (Tailwind CSS v4)

Tailwind CSS v4 eliminates the Javascript `tailwind.config.js` in favor of inline CSS declarations. All tokens, variables, and responsive behaviors are configured in `app/globals.css`.

### Core Design System Tokens

```css
@theme inline {
  /* Brand Color System */
  --color-primary: #010081;                /* Core Brand Dark Blue */
  --color-secondary: #ffdf93;              /* Secondary Accent Yellow */
  --color-base-white: #fafafa;
  --color-base-black: #0a0a0b;

  /* Color Variations */
  --color-primary-100: #d5d5ff; to --color-primary-1000: #01004d;
  --color-secondary-100: #fff7e4; to --color-secondary-1000: #6d4d00;
  --color-neutrals-100: #e3e3e3; to --color-neutrals-1000: #151314;

  /* Semantic System */
  --color-success: #a4f4e7;
  --color-warning: #f4c790;
  --color-error: #e4626f;

  /* Spacing Scale */
  --spacing-xxs: 0.25rem;                  /* 4px */
  --spacing-sm: 0.75rem;                   /* 12px */
  --spacing-m: 1rem;                       /* 16px */
  --spacing-xl: 2.5rem;                    /* 40px */

  /* Border Radii */
  --radius-sm: 0.375rem;                   /* 6px */
  --radius-m: 0.625rem;                    /* 10px */
  --radius-lg: 1.5rem;                     /* 24px */
  --radius-round: 999px;                   /* Perfect Circle */

  /* Timing System */
  --duration-instant: 75ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
}
```

### Typography Settings
Fonts are loaded using `next/font/google` in `app/layout.tsx` and mapped to CSS variables to prevent layout shift.
* **Serif Headings:** `Lora`
* **Sans-Serif UI text:** `Geist Sans`
* **Body / Reading text:** `Poppins`
* **Monospaced elements:** `JetBrains Mono` / `Geist Mono`

---

## 8. Data Fetching, Security, & Error Boundaries

The application uses **Axios** (defined in `lib/api.ts`) as its low-level fetching client, which is then wrapped in **TanStack React Query** hooks for robust state management.

### Backend CSRF & Sanctum Integration
To securely communicate with backend APIs (such as Laravel Sanctum):
- **Cookie Security:** The Axios client is pre-configured with `withCredentials = true` and `withXSRFToken = true` to automatically extract, store, and send back CSRF session headers.
- **Handshake Pattern:** Mutation flows (like logging in) trigger a pre-flight call to `/sanctum/csrf-cookie` (via `useSanctumCookie`) to establish session safety before submitting credentials.

### Centralized Response Interceptor (Global Error Boundaries)
The Axios configuration features a global interceptor that handles errors seamlessly:
1. **Network & Validation Failures:** Automatically displays a customized, styled error toast using `sonner`.
2. **Session Expiration (401 Errors):**
   - If a 401 Unauthenticated status is intercepted from any API call, the client automatically clears user sessions and forces a redirect (`window.location.href = "/login"`).
   - Exemptions are made if the failure is on the `/login` route itself, preventing endless redirect loops.

---

## 9. Form Validation & Complex Inputs Pattern

Forms in Skoolpro are built using **React Hook Form** paired with **Zod** to ensure type safety from user input down to the database schema.

### Nested Form Architecture
```tsx
<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <Input name="email" label="Enter email" type="email" />
    <Button loading={isPending}>Submit</Button>
  </form>
</FormProvider>
```
Using `<FormProvider>` allows deeply nested input components to register with the main form context automatically, removing the need to prop-drill form control handlers.

### Custom Floating Label Inputs
Our custom input element (`components/ui/form/input/input.tsx`) features several advanced behaviors:
* **Floating Labels:** Uses CSS peers to animate labels dynamically based on focus and value states.
* **Password Toggle:** Built-in visibility toggle control for password fields.
* **Error States:** Automatically displays localized Zod error messages and validation warning icons.
* **Loaders:** Integrates dynamic state loaders inside input fields when dealing with asynchronous validation actions.

---

## 10. Developer Best Practices & Coding Standards

1. **Co-locate Routing Components:** Keep page files (`page.tsx`) lightweight. Put layout structures, complex tables, and specialized interactive buttons into `_components/` relative to that specific page path.
2. **Strict Folder Structure inside `/features`:** Do not let feature files mix. Always separate schemas from api query files to maintain structured boundaries.
3. **Do Not Direct-Style Components:** Avoid hardcoding hex colors or pixel spacings. Always use Tailwind v4 design tokens (`bg-primary`, `p-sm`, `rounded-lg`) to ensure visual consistency with the design system.
4. **No Direct Axios calls in UI:** Never trigger direct fetch or Axios calls from within a component's body. Always wrap requests inside a TanStack React Query hook (`useMutation` or `useQuery`) declared in the feature's `api/` directory.
5. **Linting and Diagnostics:** Before submitting code, run eslint diagnostics:
   ```bash
   npm run lint
   ```
   Ensure your code contains zero TypeScript compilation warnings and passes the standard Next.js 16 build rules:
   ```bash
   npm run build
   ```
