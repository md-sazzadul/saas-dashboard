# SEO, Accessibility & Performance Improvements

A complete audit and improvement pass across the Meridian SaaS dashboard. Every change maps to a specific WCAG 2.1 success criterion, Google SEO best practice, or Core Web Vitals metric.

---

## 1. `index.html` — Metadata & Performance

### SEO Metadata

- **`<title>`** — Descriptive, keyword-rich title: `"Meridian — SaaS Analytics Dashboard"`
- **`<meta name="description">`** — 155-character summary for SERP snippets
- **Open Graph tags** (`og:title`, `og:description`, `og:image`, `og:type`, etc.) — Required for rich social sharing previews on LinkedIn, Slack, Twitter
- **Twitter Card tags** — `summary_large_image` card for full image previews on Twitter/X
- **JSON-LD structured data** — `WebApplication` schema so Google can surface the app in rich results

### Performance (Core Web Vitals)

| Improvement                                                               | Impact                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `<link rel="preconnect">` to Google Fonts                                 | Eliminates DNS + TLS handshake delay (~100-300ms)             |
| `<link rel="prefetch">` for `/data/dashboard.json` and `/data/users.json` | Data is in browser cache before React mounts                  |
| Fonts moved from CSS `@import` → `<link rel="stylesheet">` in HTML        | Removes a render-blocking round-trip (improves FCP/LCP)       |
| Inline theme-init `<script>`                                              | Applies dark/light class before first paint — eliminates FOUC |

### App Chrome

- `theme-color` meta tags (light + dark) — colours the browser chrome on Android Chrome and iOS Safari PWA
- `color-scheme` meta — signals dark mode support to browsers
- `apple-mobile-web-app-*` meta tags — enables add-to-homescreen with correct status bar
- `site.webmanifest` — full PWA manifest with icons, display mode, and theme colour

### Accessibility

- **Skip navigation link** — first focusable element; jumps to `#main-content` for keyboard/screen-reader users (WCAG 2.4.1)

---

## 2. `index.css` — Stylesheet Improvements

### Removed

- `@import url("https://fonts.googleapis.com/...")` — moved to HTML `<link>` for performance

### Added: Reduced Motion (`prefers-reduced-motion: reduce`)

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; ... }
}
```

- Satisfies **WCAG 2.1 SC 2.3.3** (Animation from Interactions)
- Users with vestibular disorders, epilepsy, or motion sensitivity no longer see animations

### Improved: Focus Ring

- `box-shadow` fallback added alongside `outline` — visible even inside `overflow: hidden` containers
- `:focus:not(:focus-visible)` removes ring for mouse clicks only (no ring pollution)
- Satisfies **WCAG 2.1 SC 2.4.7** (Focus Visible) and **SC 1.4.11** (Non-text Contrast)

### Added: High Contrast Mode

```css
@media (forced-colors: active) { ... }
```

- Windows High Contrast Mode support — borders remain visible

### Added: Print Styles

- Hides sidebar, nav, and interactive chrome when printing

### Added: `.sr-only` utility

- Accessible off-screen hiding (vs `display:none` which removes from AT)

---

## 3. `DashboardLayout.tsx` — Semantic Landmarks

| Before                                  | After                                                       | WCAG SC      |
| --------------------------------------- | ----------------------------------------------------------- | ------------ |
| `<div>` sidebar                         | `<aside aria-label="Application sidebar">`                  | 1.3.1, 4.1.2 |
| `<div>` nav                             | `<nav aria-label="Primary navigation">`                     | 1.3.1, 2.4.1 |
| Nav links as `<a>` with no active state | `aria-current="page"` on active link                        | 2.4.4        |
| `<div>` nav items                       | `<ul role="list"><li>` per item                             | 1.3.1        |
| Plain `<div>` header                    | `<header>` (banner landmark)                                | 1.3.1        |
| `<div>` breadcrumb                      | `<nav aria-label="Breadcrumb"><ol>` + `aria-current="page"` | 2.4.8        |
| `<div>` main content                    | `<main id="main-content" tabIndex={-1}>`                    | 1.3.1, 2.4.1 |
| Logo as `<div>`                         | `<a aria-label="Meridian — go to dashboard home">`          | 1.1.1, 4.1.2 |
| All icons unlabelled                    | `aria-hidden="true"` on decorative icons                    | 1.1.1        |
| Sign out button: no label               | `aria-label="Sign out of Meridian"`                         | 4.1.2        |

---

## 4. `Dashboard.tsx` — Dynamic Content Accessibility

### Heading Hierarchy

```
<h1> Dashboard                          (page title)
  <h2> Key metrics (sr-only)           (stats section)
  <h2> Revenue overview chart (sr-only) (chart section)
  <h2> Users                           (users section)
```

Satisfies **WCAG 2.4.6** (Headings and Labels) — never skips a level.

### ARIA Live Regions

- **Off-screen announcer** (`aria-live="polite"`) — announces search result counts and filter changes to screen readers without visual disruption
- `aria-live="polite"` on result count `<p>` — immediate count feedback
- `role="alert" aria-live="assertive"` on error states — errors announced immediately
- `aria-busy="true"` + `aria-label` on loading containers — AT knows what's loading

### Semantic Elements

- `<time dateTime="...">` wraps the date display — machines can parse it
- `<section aria-labelledby="...">` for each major region — navigable landmarks
- `<strong>` replaces `<span>` for search query emphasis in "No results"

---

## 5. `UsersTable.tsx` — Accessible Table

| Improvement                                                      | WCAG SC            |
| ---------------------------------------------------------------- | ------------------ |
| `<caption className="sr-only">` — describes the table            | 1.3.1              |
| `scope="col"` on all `<th>`                                      | H63 technique      |
| `aria-sort` on sortable `<th>` (`ascending`/`descending`/`none`) | ARIA21 technique   |
| `<th>` keyboard handler (`Enter`/`Space` to sort)                | 2.1.1              |
| `aria-label` on clickable rows (full description)                | 4.1.2              |
| `onKeyDown` on rows for keyboard activation                      | 2.1.1              |
| `overflow-x-auto` wrapper                                        | SC 1.4.10 (Reflow) |
| `<abbr title="User identifier N">` on ID                         | 3.1.4              |
| `<mark>` for search highlights (not styled `<span>`)             | 1.3.1              |
| All icons `aria-hidden="true"`                                   | 1.1.1              |

---

## 6. `UserDrawer.tsx` — Modal Dialog Pattern

Implements the complete **WAI-ARIA Modal Dialog** pattern:

| Feature               | Implementation                                   |
| --------------------- | ------------------------------------------------ |
| Dialog role           | `role="dialog" aria-modal="true"`                |
| Accessible name       | `aria-labelledby="drawer-title"`                 |
| Description           | `aria-describedby="drawer-description"`          |
| Focus trap            | Cycles Tab/Shift+Tab within focusable elements   |
| Focus on open         | `drawerRef.current?.focus()` after animation     |
| **Focus restoration** | Returns focus to the triggering element on close |
| Escape to close       | `keydown` listener removed on unmount            |
| Backdrop              | `aria-hidden="true"` (decorative overlay)        |
| Progress bar          | `role="meter" aria-valuenow/min/max/label`       |
| `<hr>` divider        | Replaces `<div>` (semantic horizontal rule)      |

---

## 7. `Login.tsx` — Accessible Form

| Improvement                                         | WCAG SC                           |
| --------------------------------------------------- | --------------------------------- |
| `<main>` wraps the page                             | 1.3.1                             |
| `<form noValidate>` with `onSubmit` (not `onClick`) | 2.1.1                             |
| `<label htmlFor="...">` for every input             | 1.3.1, 4.1.2                      |
| `aria-invalid` on invalid fields                    | SC 3.3.1                          |
| `aria-describedby` links input to its error         | SC 3.3.1                          |
| `aria-required="true"` on required fields           | SC 3.3.2                          |
| `<button type="submit">` (not `type="button"`)      | 2.1.1                             |
| `aria-busy` on submit button during loading         | 4.1.3                             |
| `role="alert" aria-live="assertive"` on errors      | SC 3.3.1                          |
| `<code>` replaces `<span>` for demo credentials     | 1.3.1                             |
| `autoComplete="email"` / `"current-password"`       | SC 1.3.5 (Identify Input Purpose) |

---

## 8. `Pagination.tsx` — Navigation Landmarks

- `<nav aria-label="Pagination, page N of M">` — named landmark (WCAG 2.4.1)
- `aria-current="page"` on active page button (WCAG 2.4.8)
- `aria-label="Go to page N"` on each page button (4.1.2)
- `aria-label="Go to previous/next page"` on nav buttons (4.1.2)
- `aria-live="polite"` on item range `<p>` — announces page changes (4.1.3)
- `<ol role="list">` — ordered list of pages (1.3.1)
- Ellipsis items `aria-hidden="true"` — decorative (1.1.1)

---

## 9. `SearchBar.tsx`

- `role="search"` on wrapper — named search landmark (2.4.1)
- `type="search"` on input — activates mobile search keyboard
- `aria-label` on input (no visible label present)
- `aria-describedby="search-hint"` — keyboard shortcut announced on focus
- `aria-label="Clear search"` on clear button (4.1.2)
- `autoComplete="off" spellCheck={false}` — prevents autocomplete interference

---

## 10. `ThemeToggle.tsx`

- `aria-pressed={isDark}` — toggle button state (ARIA authoring practice)
- `aria-label` describes the action, not state: `"Switch to light mode"` (4.1.2)

---

## 11. `Filters.tsx`

- `role="radiogroup"` + `role="radio"` + `aria-checked` — mutually exclusive selection pattern (1.3.1, 4.1.2)
- `aria-labelledby="filter-label"` on the group — associates visible label with the group

---

## 12. `ChartSection.tsx`

- `role="img"` + `aria-label` with full data summary — text alternative for the SVG chart (WCAG 1.1.1)
- `<figcaption className="sr-only">` — belt-and-suspenders text alternative
- `aria-hidden="true"` on chart wrapper — prevents AT from reading raw SVG noise
- `focusable="false"` on SVG — prevents IE/Edge from adding it to the tab order

---

## 13. `StatsCards.tsx`

- `<article aria-label={title}>` per card — self-contained content unit (1.3.1)
- `<h3>` for card titles — correct heading level (h1→h2→h3) (2.4.6)
- `aria-label` on delta badge — converts "+12.4%" into "Increased 12.4% vs last month" (1.1.1)
- `aria-hidden="true" focusable="false"` on sparkline SVGs (1.1.1)

---

## 14. `Skeleton.tsx`

- `aria-hidden="true"` on skeleton wrapper — removes decorative loading chrome from AT
- Parent caller uses `aria-busy="true"` + `aria-label` for AT communication

---

## WCAG 2.1 Coverage Summary

| Level   | Criteria Addressed                                                          |
| ------- | --------------------------------------------------------------------------- |
| **A**   | 1.1.1, 1.3.1, 2.1.1, 2.4.1, 2.4.3, 2.4.4, 3.3.1, 3.3.2, 4.1.1, 4.1.2, 4.1.3 |
| **AA**  | 1.4.3, 1.4.10, 1.4.11, 2.4.6, 2.4.7, 2.4.8, 3.1.4, 3.3.3, 3.3.4             |
| **AAA** | 2.3.3 (Animation from Interactions — `prefers-reduced-motion`)              |

---

## Core Web Vitals Impact

| Metric                              | Change                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| **FCP** (First Contentful Paint)    | ↓ — Fonts load in parallel (preconnect + `<link>`) instead of after CSS parse |
| **LCP** (Largest Contentful Paint)  | ↓ — No FOUC delay; theme applied before paint                                 |
| **CLS** (Cumulative Layout Shift)   | ↓ — `scrollbar-gutter: stable`; `font-display: swap` prevents FOUT reflow     |
| **INP** (Interaction to Next Paint) | — Unchanged (already optimised with `useCallback`/`useMemo`)                  |
| **TTFB** (Time to First Byte)       | ↓ — `prefetch` on data JSON files; in cache before React fetches              |
