# Meridian — SaaS Analytics Dashboard

A production-grade analytics dashboard built with React 19, TypeScript, and Tailwind CSS v4. Demonstrates real-world frontend architecture patterns: data fetching, client-side state management, accessibility, and polished UI/UX.

**Live demo credentials:** `admin@example.com` / `123456`

---

## Screenshots

> Dashboard overview with stats cards, revenue chart, and paginated user table — available in both light and dark mode.

---

## Features

**Data & State**

- Server-state management via **TanStack Query v5** with configurable `staleTime`, `gcTime`, and retry policies
- Optimistic UI updates and per-query error boundaries with retry actions
- Multi-layer data pipeline: filter → search → sort → paginate, each isolated in its own custom hook

**UI/UX**

- Responsive **area chart** (Recharts) with custom tooltip, gradient fill, and axis formatting
- Sortable, searchable, paginated **users table** with live search highlighting and animated results
- **Slide-over user drawer** with keyboard (`Escape`) dismissal and focus trapping
- Skeleton loading states, empty states, and granular error states at both page and section level
- Keyboard shortcut `⌘K` / `Ctrl+K` to focus the search bar

**Auth & Routing**

- JWT-based authentication flow with protected routes via React Router v7
- Token persistence in `localStorage` with automatic redirect on expiry
- Form validation (client-side, with live re-validation post-submission) and accessible error messaging

**Design System**

- **Dark / light mode** with `prefers-color-scheme` detection, persisted to `localStorage`
- CSS custom properties for surfaces, accent colors, and chart theming — zero Tailwind config needed
- Custom typography scale using DM Sans, DM Mono, and Syne via Google Fonts
- Staggered entrance animations, shimmer skeletons, and smooth micro-interactions throughout

---

## Tech Stack

| Layer         | Choice                          | Why                                              |
| ------------- | ------------------------------- | ------------------------------------------------ |
| Framework     | React 19                        | Latest stable with concurrent features           |
| Language      | TypeScript 5.8 (strict)         | End-to-end type safety                           |
| Build         | Vite 7                          | Sub-second HMR, native ESM                       |
| Styling       | Tailwind CSS v4 + CSS variables | Utility-first with design token flexibility      |
| Data fetching | TanStack Query v5               | Declarative server state, caching, deduplication |
| Charts        | Recharts 3                      | Composable, responsive SVG charts                |
| Routing       | React Router v7                 | File-based routing, nested layouts               |
| Notifications | React Hot Toast                 | Accessible, themeable toasts                     |
| Icons         | React Icons (HeroIcons)         | Consistent icon set                              |
| HTTP          | Axios                           | Interceptor support, typed responses             |
| Linting       | ESLint 9 + TypeScript-ESLint    | Strict rules, hooks plugin                       |

---

## Architecture

```
src/
├── app/                  # Router and QueryClient configuration
├── components/
│   ├── layout/           # DashboardLayout, ProtectedRoute
│   └── ui/               # ThemeToggle (reusable atoms)
├── context/              # ThemeContext
├── features/
│   ├── auth/             # Login page, auth API, validation
│   └── dashboard/
│       ├── api/          # Fetch functions (decoupled from hooks)
│       ├── components/   # ChartSection, UsersTable, UserDrawer, StatsCards…
│       ├── hooks/        # useDashboard, useUsers, useSort, useSearch,
│       │                 # useFilteredUsers, usePagination
│       ├── pages/        # Dashboard (orchestration layer only)
│       └── types.ts      # Shared domain types
├── hooks/                # useTheme, useToast (cross-feature)
├── providers/            # ThemeProvider
├── types/                # Global type definitions
└── utils/                # auth.ts (token helpers)
```

**Key patterns:**

- **Feature-first structure** — each feature owns its API, hooks, components, and types
- **Custom hook per concern** — `useSort`, `useSearch`, `useFilteredUsers`, `usePagination` are individually unit-testable
- **Separation of concerns** — pages only orchestrate; all logic lives in hooks; all data access lives in `api/`
- **Strict TypeScript** — `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` all enabled

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type-check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

---

## Design Decisions

**Why TanStack Query instead of `useEffect` + `useState`?**  
Eliminates boilerplate for loading/error states, handles request deduplication, and provides a clean cache invalidation model. The dashboard configures `staleTime: 5min` — appropriate for aggregate data that doesn't need to be live.

**Why feature-first over layer-first?**  
Co-locating API, hooks, types, and components within a feature makes the codebase navigable by domain rather than by file type. Adding a new feature means touching one folder, not six.

**Why CSS custom properties alongside Tailwind?**  
Tailwind handles layout and spacing utilities. CSS variables handle semantic design tokens (surfaces, accent, chart colors) that need to respond to theme changes at runtime without JavaScript. The two complement each other.

**Why `useCallback` / `useMemo` in Dashboard?**  
The Dashboard page passes handlers deep into the component tree. Memoizing them prevents unnecessary re-renders of `UsersTable`, `Filters`, and `SearchBar` when unrelated state (e.g. `selectedUser`) changes.

---

## What I'd Add Next

- **Unit tests** for custom hooks (`useSort`, `usePagination`, `useFilteredUsers`) with Vitest + Testing Library
- **E2E tests** for the auth flow and table interactions with Playwright
- **React Query DevTools** in development
- **Virtualized list** (TanStack Virtual) for large user datasets
- **Real API integration** — swap `fetch('/data/...')` for an authenticated REST or GraphQL client
- **Role-based access** — extend `ProtectedRoute` with permission checks
- **Storybook** for the component library

---

## Author

Built as a demonstration of production frontend practices — clean architecture, accessible UI, and thoughtful UX.
