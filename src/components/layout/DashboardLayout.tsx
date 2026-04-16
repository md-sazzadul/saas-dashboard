import toast from "react-hot-toast";
import { HiArrowRightOnRectangle, HiHome, HiSquares2X2 } from "react-icons/hi2";
import { Outlet, useLocation } from "react-router";
import { logout } from "../../utils/auth";
import ThemeToggle from "../ui/ThemeToggle";

const NAV_ITEMS = [{ href: "/dashboard", icon: HiHome, label: "Dashboard" }];

const DashboardLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    toast.success("Signed out successfully.");
    setTimeout(logout, 800);
  };

  return (
    /*
      Top-level wrapper: role="application" would be too broad here; a plain
      div is correct — the semantic landmarks below (nav, header, main) do
      the structural work for AT.
    */
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--surface-0)" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────
          <aside> is a landmark region (complementary). aria-label
          distinguishes it from any other <aside> on the page.
      ─────────────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Application sidebar"
        className="w-60 flex flex-col shrink-0 border-r animate-slide-left"
        style={{
          background: "var(--surface-1)",
          borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
        }}
      >
        {/* Brand — wrapped in <div> with role="banner" semantics already
            provided by the page-level <header> below; here it's decorative. */}
        <div
          className="px-5 pt-6 pb-5 border-b"
          style={{
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          {/* aria-label gives the link a meaningful name for screen readers
              instead of the bare text "Meridian" */}
          <a
            href="/dashboard"
            aria-label="Meridian — go to dashboard home"
            className="flex items-center gap-2.5 w-fit"
          >
            {/* aria-hidden: decorative icon; the link label covers it */}
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--accent)" }}
            >
              <HiSquares2X2 className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Meridian
            </span>
          </a>
        </div>

        {/* ── Primary navigation ────────────────────────────────────────
            <nav> is a landmark; aria-label distinguishes it from the
            breadcrumb nav in the header. "aria-current" marks the active
            page for screen readers (WCAG 2.4.4).
        ──────────────────────────────────────────────────────────────── */}
        <nav
          aria-label="Primary navigation"
          className="flex-1 px-3 py-4 space-y-0.5"
        >
          {/* Hidden heading gives the nav list context for AT */}
          <p
            className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600"
            aria-hidden="true"
          >
            Main
          </p>
          <ul role="list" className="space-y-0.5">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const isActive = location.pathname === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              "color-mix(in srgb, var(--accent) 10%, transparent)",
                          }
                        : {}
                    }
                  >
                    {/* aria-hidden: icon is decorative; link text provides the name */}
                    <Icon
                      aria-hidden="true"
                      className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                        isActive ? "text-indigo-500 dark:text-indigo-400" : ""
                      }`}
                    />
                    {label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Sidebar footer ──────────────────────────────────────────── */}
        <div
          className="px-3 py-4 border-t"
          style={{
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          <button
            onClick={handleLogout}
            type="button"
            aria-label="Sign out of Meridian"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-all duration-150 group"
          >
            <HiArrowRightOnRectangle
              aria-hidden="true"
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Page header ───────────────────────────────────────────────
            <header> as a direct child of the layout div is treated as a
            "banner" landmark by AT, providing site-wide context.
        ──────────────────────────────────────────────────────────────── */}
        <header
          className="h-14 shrink-0 flex items-center justify-between px-6 border-b"
          style={{
            background: "var(--surface-1)",
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          {/* ── Breadcrumb navigation ──────────────────────────────────
              <nav aria-label="Breadcrumb"> is the correct pattern per
              WCAG technique G128 for breadcrumb trails.
          ─────────────────────────────────────────────────────────── */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li aria-hidden="true">
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  /
                </span>
              </li>
              <li>
                <span
                  aria-current="page"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Overview
                </span>
              </li>
            </ol>
          </nav>

          <div
            className="flex items-center gap-3"
            role="group"
            aria-label="Header controls"
          >
            {/* Live indicator */}
            <div
              className="hidden sm:flex items-center gap-1.5"
              aria-label="Data is live"
              title="Dashboard data is live"
            >
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">
                Live
              </span>
            </div>

            <div
              aria-hidden="true"
              className="w-px h-4 bg-gray-200 dark:bg-gray-800"
            />
            <ThemeToggle />
          </div>
        </header>

        {/* ── Page content ──────────────────────────────────────────────
            id="main-content" corresponds to the skip-nav link in index.html.
            tabIndex={-1} lets the skip-nav focus this element
            programmatically without adding it to the tab order.
        ──────────────────────────────────────────────────────────────── */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-6 focus:outline-none"
          style={{ background: "var(--surface-0)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
