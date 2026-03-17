# Copilot Instructions for PortalEmpleo Frontend

## Project Overview
**PortalEmpleo** is a Next.js 16+ frontend for a job portal with two user roles: **Postulante** (job seeker) and **Administrador Empresa** (company admin). The app uses TypeScript, Tailwind CSS, React 19, and connects to a backend API via JWT authentication.

## Architecture & Data Flow

### Stack
- **Framework**: Next.js 16 (App Router with SSR/SSG)
- **State Management**: Zustand (`useAuthStore`)
- **Authentication**: NextAuth v5 (JWT-based with credentials provider)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS v4 + PostCSS
- **Carousels**: Swiper (CSS imported in components)

### Authentication Flow
1. User logs in via `app/auth/login` → calls `signInApi()` from `lib/auth/signin.ts`
2. Backend returns `{ token, refreshToken, userId, fullName, role, tokenExpireIn }`
3. NextAuth stores JWT token with 30-min max age, 5-min update age in `auth.ts`
4. Client hydrates Zustand `useAuthStore` via `components/AuthHydrator.tsx`
5. Token refresh happens automatically in JWT callback (see `auth.ts` lines 40-50)
6. Access token passed to API calls via `fetchApi` utility with `token` param

### API Client Pattern
Use `lib/apiClient.ts:fetchApi()` for all external requests:
```typescript
const data = await fetchApi<DataType>('/endpoint', {
  method: 'POST',
  body: { key: 'value' },
  token: session?.user.accessToken,
});
if (!data) return null; // Always check for null
```

## File Organization & Conventions

### Page Structure
- **App Pages**: `app/[module]/page.tsx` - async components that fetch data server-side
- **Layouts**: `app/[module]/layout.tsx` - wraps pages with shared chrome
- **API Routes**: `app/api/[...nextauth]` - NextAuth credentials handler only

### Component Layers
1. **Shared Components** (`components/shared/`) - Reusable across the app (Navbar, Footer, MainLayout)
2. **UI Library** (`components/ui/`) - Radix UI + Tailwind wrappers (Button, Card, Dialog, etc.)
3. **Feature Components** (`app/[module]/components/`) - Module-specific, e.g., `Filters.tsx`, `JobList.tsx`

### Library Functions (`lib/`)
Organize by domain:
- `lib/auth/` - signin/signup API wrappers
- `lib/jobs/` - job fetching (recent, favorites, details)
- `lib/company/` - company profile & form helpers
- `lib/search/` - filter & search endpoints
- `lib/apiClient.ts` - HTTP utility
- `lib/hooks.tsx` - custom hooks (e.g., `useDebouncedValue`)

### Type Definitions (`types/`)
- `types/user.ts` - UserAuthData, LoginData, RefreshToken
- `types/jobs.ts` - Job, Vacancy interfaces
- `types/company.ts` - Company, Admin data
- `types/search.ts` - Filter, SearchParams

### Mock Data (`lib/mocks/`)
- Used for UI development/testing
- Example: `lib/mocks/jobs.json`, `lib/mocks/testimonials.json`

## Key Patterns & Conventions

### 1. Server-Side Data Fetching
Use async components in pages, avoid client-side fetching for initial page data:
```typescript
// ✅ Correct (app/page.tsx)
export default async function Home() {
  const jobs = await fetchRecentJobs();
  const session = await auth();
  return <RecentJobs jobs={jobs} />;
}
```

### 2. Form Validation
All forms use React Hook Form + Zod:
```typescript
// In lib/testimonials/schema.ts
export const testimonialFormSchema = z.object({
  cargo: z.string().min(1, "El cargo es obligatorio"),
  empresa: z.string().min(1, "La empresa es obligatoria"),
  testimonioDetalle: z
    .string()
    .min(20, "El testimonio debe tener al menos 20 caracteres")
    .max(500, "El testimonio no puede exceder los 500 caracteres"),
  calificacion: z
    .number()
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
});

// In component
const form = useForm<z.infer<typeof testimonialFormSchema>>({
  resolver: zodResolver(testimonialFormSchema),
});
```

### 3. Client Components
Mark with `"use client"` at the top. Use sparingly—prefer server components:
```typescript
"use client";
import { useAuthStore } from "@/context/authStore";
import { useRouter } from "next/navigation";
```

### 4. Responsive Design & Media Queries
Use Tailwind breakpoints (`sm:`, `md:`, `lg:`). Example from Swiper:
- Navigation arrows: show on `lg:` screens only
- Pagination dots: show on `sm:` and `md:` only

### 5. API Error Handling
Always check for null returns from `fetchApi`:
```typescript
const data = await fetchApi<Jobs>('/api/jobs', { token });
if (!data) {
  console.warn('Failed to fetch jobs');
  return [];
}
```

### 6. Testimonials & Carousels
- **Swiper CSS**: Import in components where used (e.g., `import "swiper/css"; import "swiper/css/pagination";`)
- **API Response**: Returns `GenericResponse<Testimonial[]>`
- **Accessibility**: Add `focus:ring-2 focus:ring-primary` to interactive cards

## Development Workflows

### Build & Run
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Check ESLint (config: eslint.config.mjs)
```

### Authentication Testing
- Use credentials provider (NextAuth doesn't support external OAuth in this setup)
- Session stored client-side; manually test token refresh by waiting 5+ min

### Adding New Pages
1. Create `app/[module]/page.tsx` as async server component
2. Create `app/[module]/layout.tsx` if layout differs from parent
3. Use `app/[module]/components/` for module-specific components
4. Import from `lib/[domain]/` for data fetching

## Known Issues & Gotchas

1. **Swiper CSS**: Import in components where used, not globally
2. **Testimonials API Shape**: Always `GenericResponse<Testimonial[]>`
3. **Session Hydration**: Client must call auth hydrator before rendering protected UI
4. **Token Expiry**: JWT maxAge is 30 min; refresh happens automatically at 5-min boundary
5. **Email Auth**: Email signup via `app/auth/email/` requires confirmation flow (not yet fully integrated)

## Role-Based Access
- **Postulante**: Browse jobs, apply, manage profile (`app/profile/`)
- **Administrador Empresa**: Manage company profile, post jobs, view candidates (`app/empresa-profile/`)
- Check `types/auth.ts` for ROLES constant and validate `session?.user.role`

## Aliases
- `@/*` → root of `src/FrontEnd`

---

**Last updated**: January 2026 | **Branch**: RB/companyMethods
