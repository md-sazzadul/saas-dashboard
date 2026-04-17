# Meridian — SaaS Analytics Dashboard

A production-grade analytics dashboard built with React 19, TypeScript, and Tailwind CSS v4. Demonstrates real-world frontend architecture patterns: data fetching, client-side state management, accessibility, and polished UI/UX.

**Live demo:** [saas-dashboard-sazzad15.netlify.app](https://saas-dashboard-sazzad15.netlify.app/)  
**Credentials:** `admin@example.com` / `123456`

---

<!-- ## Screenshots

> Dashboard overview with stats cards, revenue chart, and paginated user table — available in both light and dark mode.

--- -->

## Tech Stack

| Layer         | Choice                                  |
| ------------- | --------------------------------------- |
| Framework     | React 19                                |
| Language      | TypeScript 5.8 (strict)                 |
| Build         | Vite 7                                  |
| Styling       | Tailwind CSS v4 + CSS custom properties |
| Server state  | TanStack Query v5                       |
| Charts        | Recharts 3                              |
| Routing       | React Router v7                         |
| Notifications | React Hot Toast                         |
| Icons         | React Icons (HeroIcons v2)              |
| HTTP          | Axios                                   |
| Linting       | ESLint 9 + TypeScript-ESLint            |

---

## Features

**Data & State**

- TanStack Query v5 with `staleTime: 5min`, `gcTime: 10min`, and single-retry policies
- Multi-layer data pipeline: filter → search → sort → paginate, each in its own isolated custom hook
- Optimistic error states with per-section retry actions

**UI/UX**

- Responsive area chart (Recharts) with gradient fill, custom tooltip, and axis formatting
- Sortable, searchable, paginated users table with live search highlighting
- Slide-over user drawer with keyboard (`Escape`) dismissal and focus trapping
- Skeleton loading states, empty states, and granular error states
- Keyboard shortcut `⌘K` / `Ctrl+K` to focus the search bar

**Accessibility (WCAG 2.1)**

- Full semantic landmark structure (`<main>`, `<nav>`, `<aside>`, `<header>`, `<section>`)
- `aria-live` regions for dynamic content announcements (search results, filter changes)
- WAI-ARIA modal dialog pattern in `UserDrawer` with focus trap and focus restoration
- `aria-sort` on sortable table headers; `<mark>` for search highlights; `<caption>` on tables
- `prefers-reduced-motion` support disables all animations for users who opt out
- Skip navigation link for keyboard users
- Covers WCAG 2.1 Level A, AA, and select AAA criteria

**Performance**

- Font loading via `<link rel="stylesheet">` instead of CSS `@import` (removes render-blocking round-trip)
- `<link rel="preconnect">` to Google Fonts
- `<link rel="prefetch">` on data JSON files so they land in cache before React mounts
- Inline theme-init script prevents flash of unstyled content (FOUC)
- `scrollbar-gutter: stable` eliminates cumulative layout shift from scrollbar appearance

**Auth & Routing**

- JWT-based flow with protected routes via React Router v7
- Token persisted in `localStorage` with automatic redirect on expiry
- Client-side form validation with live re-validation after first submission

**Design System**

- Dark / light mode with `prefers-color-scheme` detection, persisted to `localStorage`
- CSS custom properties for surfaces, accent colors, and chart theming
- Typography: DM Sans (body), DM Mono (code/numbers), Syne (display headings)
- Staggered entrance animations and shimmer skeletons

---

## Project Structure

```
src/
├── app/                  # Router and QueryClient configuration
├── components/
│   ├── layout/           # DashboardLayout, ProtectedRoute
│   └── ui/               # ThemeToggle
├── context/              # ThemeContext
├── features/
│   ├── auth/             # Login page, auth API, validation
│   └── dashboard/
│       ├── api/          # Fetch functions (decoupled from hooks)
│       ├── components/   # ChartSection, UsersTable, UserDrawer, StatsCards,
│       │                 # SearchBar, Filters, Pagination, Skeleton, …
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
- **One hook per concern** — `useSort`, `useSearch`, `useFilteredUsers`, `usePagination` are individually unit-testable
- **Separation of concerns** — pages orchestrate; logic lives in hooks; data access lives in `api/`
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
Eliminates boilerplate for loading/error states, handles request deduplication, and provides a clean cache invalidation model. A 5-minute `staleTime` is appropriate for aggregate dashboard data that doesn't need to be live.

**Why feature-first over layer-first?**  
Co-locating API, hooks, types, and components within a feature makes the codebase navigable by domain. Adding a new feature means touching one folder, not six.

**Why CSS custom properties alongside Tailwind?**  
Tailwind handles layout and spacing utilities. CSS variables handle semantic design tokens (surfaces, accent, chart colors) that need to respond to theme changes at runtime without JavaScript.

**Why `useCallback` / `useMemo` in Dashboard?**  
The Dashboard page passes handlers deep into the component tree. Memoizing them prevents unnecessary re-renders of `UsersTable`, `Filters`, and `SearchBar` when unrelated state (e.g. `selectedUser`) changes.

---

## What's Next

- Unit tests for custom hooks (`useSort`, `usePagination`, `useFilteredUsers`) with Vitest + Testing Library
- E2E tests for the auth flow and table interactions with Playwright
- React Query DevTools in development
- Virtualized list (TanStack Virtual) for large user datasets
- Real API integration — swap `fetch('/data/...')` for an authenticated REST or GraphQL client
- Role-based access — extend `ProtectedRoute` with permission checks
- Storybook for the component library

---

## Author

Built as a demonstration of production frontend practices — clean architecture, accessible UI, and thoughtful UX.
