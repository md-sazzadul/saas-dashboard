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
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--surface-0)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col shrink-0 border-r animate-slide-left"
        style={{
          background: "var(--surface-1)",
          borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
        }}
      >
        {/* Brand */}
        <div
          className="px-5 pt-6 pb-5 border-b"
          style={{
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
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
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Main
          </p>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = location.pathname === href;
            return (
              <a
                key={href}
                href={href}
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
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                    isActive ? "text-indigo-500 dark:text-indigo-400" : ""
                  }`}
                />
                {label}
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-3 py-4 border-t"
          style={{
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-all duration-150 group"
          >
            <HiArrowRightOnRectangle className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="h-14 shrink-0 flex items-center justify-between px-6 border-b"
          style={{
            background: "var(--surface-1)",
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-600">/</span>
            <span
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Overview
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">
                Live
              </span>
            </div>

            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "var(--surface-0)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
