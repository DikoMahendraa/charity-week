# IRUK Charity Week — CMS Dashboard

Internal content management system for **IRUK Charity Week**, used to manage fundraising campaigns, donor reports, payments, and fundraising pages.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.12 |
| Language | TypeScript | ^5 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 | ^4 |
| Component Library | shadcn/ui (Base UI) | — |
| HTTP Client | Axios | ^1 |
| Server State | TanStack Query (React Query) | ^5 |
| Client State | Zustand | ^5 |
| Forms | React Hook Form | ^7 |
| Validation | Zod | ^3 |
| Drag & Drop | dnd-kit | ^6 / ^10 |
| Icons | Lucide React | ^1 |
| Date Utilities | date-fns | ^4 |

---

## Project Structure

```
iruk-dashboard/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group — no sidebar, no guard
│   │   ├── layout.tsx            # Centered full-screen layout
│   │   ├── login/page.tsx        # Login — role selector + email/password
│   │   └── register/page.tsx     # Register — form + password strength meter
│   │
│   ├── (dashboard)/              # Protected route group — sidebar + guard
│   │   ├── layout.tsx            # AuthProvider + DashboardGuard + Sidebar shell
│   │   ├── campaign/
│   │   │   ├── institutions/     # Institution list + add dialog
│   │   │   ├── challenges/       # Challenge list + add dialog + date picker
│   │   │   └── pages/            # Fundraising page list
│   │   │       └── [id]/         # Page detail + draggable campaign table
│   │   ├── report/
│   │   │   ├── donors/           # Donor list — tabs, filters, tooltip truncation
│   │   │   │   └── [id]/         # Donor detail — sticky nav + section search
│   │   │   └── payments/         # Payment list — stat cards + tab filters
│   │   │       └── [id]/         # Payment detail — 15-section sticky nav
│   │   ├── site/cms/             # CMS placeholder
│   │   └── admin/users/          # Admin users placeholder
│   │
│   ├── unauthorized/page.tsx     # Shown on forbidden direct URL access
│   ├── layout.tsx                # Root layout — QueryProvider + TooltipProvider
│   └── page.tsx                  # Redirects → /campaign/institutions
│
├── components/
│   ├── dashboard/
│   │   ├── sidebar.tsx           # Role-filtered nav + user card + logout
│   │   ├── dashboard-guard.tsx   # Redirects to /login if role lacks access
│   │   ├── role-switcher.tsx     # Dev utility (not mounted in production)
│   │   ├── add-institution-dialog.tsx
│   │   ├── add-challenge-dialog.tsx
│   │   └── date-time-picker.tsx  # Popover calendar + time input
│   └── ui/                       # shadcn/ui primitives (powered by Base UI)
│       ├── badge.tsx             # CVA variants: live, flagged, pending, failed…
│       ├── button.tsx
│       ├── calendar.tsx          # react-day-picker v9
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       ├── table.tsx
│       └── tooltip.tsx
│
├── contexts/
│   └── auth-context.tsx          # AuthProvider, useAuth(), can(), logout(), switchRole()
│
├── stores/
│   ├── auth.store.ts             # Zustand — persisted user + JWT token
│   └── ui.store.ts               # Zustand — toasts, modals, sidebar collapse
│
├── lib/
│   ├── auth.ts                   # Role types, mock users, ROLE_LABELS
│   ├── permissions.ts            # ROUTE_PERMISSIONS map, canAccess(), defaultRouteForRole()
│   ├── utils.ts                  # cn() — clsx + tailwind-merge
│   ├── api/
│   │   ├── client.ts             # Axios instance — Bearer interceptor, typed api.*
│   │   └── endpoints.ts          # Every API URL in one place
│   ├── query/
│   │   ├── client.ts             # QueryClient config — staleTime, retry, gcTime
│   │   └── keys.ts               # Query key factory per domain
│   └── schemas/                  # Zod schemas — runtime validation + TypeScript types
│       ├── auth.schema.ts
│       ├── institution.schema.ts
│       ├── challenge.schema.ts
│       ├── page.schema.ts
│       ├── donor.schema.ts
│       └── payment.schema.ts
│
├── hooks/                        # TanStack Query hooks, one file per domain
│   ├── use-institutions.ts       # useInstitutions, useCreateInstitution, useDeleteInstitution…
│   ├── use-donors.ts             # useDonors, useDonor
│   ├── use-payments.ts           # usePayments, usePayment, useResendPaymentEmail
│   └── use-pages.ts              # usePages, usePageCampaigns, useReorderCampaigns…
│
└── providers/
    └── query-provider.tsx        # QueryClientProvider + ReactQueryDevtools (dev only)
```

---

## Architecture

### Routing & Layouts

The app uses two Next.js **route groups** to split concerns without affecting URLs:

- **`(auth)`** — public pages (login, register). No sidebar, no guard.
- **`(dashboard)`** — all protected pages. Every child is wrapped with `AuthProvider`, `DashboardGuard`, and the `Sidebar`.

```
RootLayout  (QueryProvider + TooltipProvider)
└── (dashboard)/layout.tsx
    └── AuthProvider           ← React context, reads role from localStorage
        ├── Sidebar            ← Filters nav items by current role
        └── main
            └── DashboardGuard ← Redirects → /login if no access
                └── {page}
```

---

### Authentication & RBAC

Auth is split into three layers, each with a distinct responsibility:

#### 1. `contexts/auth-context.tsx` — React context

Manages the active user object in React state. Exposes:

| Function | Purpose |
|---|---|
| `user` | Current `AuthUser` object (or `null`) |
| `can(pathname)` | Returns `true` if the user may visit that route |
| `switchRole(role)` | Dev utility — swaps the mock user |
| `logout()` | Clears session and redirects to `/login` |

On mount it reads the persisted role from `localStorage`. **To connect a real API**, replace the `useEffect` body with a session fetch (see [Connecting the Real API](#connecting-the-real-api)).

#### 2. `stores/auth.store.ts` — Zustand (persisted)

Stores the JWT `token` and `user` across page refreshes via `localStorage`. The Axios client reads the token from here to attach `Authorization: Bearer` headers automatically.

#### 3. `lib/permissions.ts` — pure permission map

```ts
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/campaign/institutions": ["super_admin", "admin"],
  "/campaign/pages":        ["super_admin", "admin", "fundraiser"],
  "/admin/users":           ["super_admin"],
  // ...
};
```

`canAccess(pathname, role)` is a **pure function** — no React dependency. It can be called from middleware, guards, or any utility. To change who can see a page, edit this file only.

#### Role matrix

| Route | Super Admin | Admin | Fundraiser |
|---|:---:|:---:|:---:|
| Campaign › Institutions | ✓ | ✓ | |
| Campaign › Challenges | ✓ | ✓ | |
| Campaign › Pages | ✓ | ✓ | ✓ |
| Report › Donors | ✓ | ✓ | |
| Report › Payments | ✓ | ✓ | |
| Site › CMS | ✓ | ✓ | |
| Admin › Users | ✓ | | |

---

### Data Fetching — TanStack Query + Axios

All server state goes through TanStack Query. The pattern for every domain is:

```
lib/schemas/[domain].schema.ts   ← Zod types + validation
lib/api/endpoints.ts             ← URL strings
hooks/use-[domain].ts            ← useQuery / useMutation wrappers
```

**Query client defaults** (`lib/query/client.ts`):

| Setting | Value | Reason |
|---|---|---|
| `staleTime` | 5 min | Data stays fresh before background refetch |
| `gcTime` | 10 min | Cache kept 10 min after component unmounts |
| Retry on 4xx | Never | Don't retry auth or validation errors |
| Retry on network | Once | Tolerate a single transient failure |

**Query key factory** (`lib/query/keys.ts`) ensures cache invalidation is always precise:

```ts
// Invalidate every institution query at once
queryClient.invalidateQueries({ queryKey: keys.institutions.all() });

// Or just the single detail
queryClient.invalidateQueries({ queryKey: keys.institutions.detail(id) });
```

**Typed HTTP helpers** (`lib/api/client.ts`):

```ts
api.get<T>(url, params?)   // GET  → response.data as T
api.post<T>(url, body?)    // POST → response.data as T
api.patch<T>(url, body?)   // PATCH
api.put<T>(url, body?)     // PUT
api.delete<T>(url)         // DELETE
```

---

### Forms — React Hook Form + Zod

Every form uses a **Zod schema** as the single source of truth for both TypeScript types and runtime validation:

```ts
// 1. Define schema once
const createInstitutionSchema = z.object({
  name:   z.string().min(1, "Required"),
  type:   z.string().min(1, "Required"),
  region: z.string().min(1, "Required"),
});
type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;

// 2. Wire into RHF
const form = useForm<CreateInstitutionInput>({
  resolver: zodResolver(createInstitutionSchema),
});

// 3. Submit goes straight to a TanStack mutation
const { mutate } = useCreateInstitution();
form.handleSubmit((data) => mutate(data));
```

---

### Client State — Zustand

Two lightweight stores cover all client-only state:

**`stores/auth.store.ts`** — JWT token + user object, persisted to `localStorage`

**`stores/ui.store.ts`** — ephemeral UI state (toasts, modals, sidebar)

```ts
// Fire a toast from anywhere — no React component needed
import { toast } from "@/stores/ui.store";

toast.success("Institution created!");
toast.error("Something went wrong.");
toast.warning("Changes not saved.");

// Open / close a typed modal
const { openModal, closeModal } = useUIStore();
openModal("confirm-delete", { id: "123" });

// Read the active modal and its payload
const { modal } = useUIStore();
if (modal?.key === "confirm-delete") {
  const { id } = modal.payload as { id: string };
}
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd iruk-dashboard

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Running

```bash
npm run dev      # Development server → http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

---

## Connecting the Real API

The codebase is structured so that swapping mock data for real API calls touches as few files as possible.

### Step 1 — Login (`app/(auth)/login/page.tsx`)

```ts
// Replace the mock block in onSubmit:

// Before
await new Promise((r) => setTimeout(r, 600));
switchRole(selectedRole);
router.push(defaultRouteForRole(selectedRole));

// After
const res = await api.post<AuthResponse>(ENDPOINTS.auth.login, {
  email: data.email,
  password: data.password,
});
useAuthStore.getState().setToken(res.token);
useAuthStore.getState().setUser(res.user);
router.push(defaultRouteForRole(res.user.role));
```

### Step 2 — Session restore (`contexts/auth-context.tsx`)

```ts
// Replace the useEffect body:

// Before
const stored = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ROLE;
setUser(MOCK_USERS[stored]);
setIsLoading(false);

// After
const { token } = useAuthStore.getState();
if (!token) { setIsLoading(false); return; }
try {
  const user = await api.get<AuthUser>(ENDPOINTS.auth.me);
  setUser(user);
} finally {
  setIsLoading(false);
}
```

### Step 3 — Replace static data in a page

```ts
// Before (static array)
const [payments, setPayments] = useState(initialPayments);

// After (real API, same component)
const { data, isLoading, error } = usePayments({ status: activeFilter });
const payments = data?.data ?? [];
```

### Step 4 — Add a new route

1. Add the URL to `lib/api/endpoints.ts`
2. Write a Zod schema in `lib/schemas/`
3. Add query keys to `lib/query/keys.ts`
4. Create a hook in `hooks/`
5. Set permissions in `lib/permissions.ts`

---

## Key Conventions

| Convention | Rule |
|---|---|
| Query keys | Always use `keys.*` factory — never inline strings |
| HTTP calls | Always use `api.*` helpers — never raw `fetch` or `axios` |
| TypeScript types | Always derived from Zod with `z.infer<>` |
| Toasts | Use `toast.*` from `stores/ui.store.ts` — works outside React |
| Permissions | Only edit `lib/permissions.ts` — never hardcode role checks in components |
| New domains | One file each in `schemas/`, `hooks/`, `endpoints.ts`, `keys.ts` |
