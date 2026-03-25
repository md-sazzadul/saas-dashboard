import { Outlet } from "react-router";
import ThemeToggle from "../ui/ThemeToggle";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <aside className="w-64 bg-gray-900 dark:bg-gray-950 dark:border-r dark:border-gray-800 text-white p-6 flex flex-col">
        <div className="text-lg font-semibold text-white mb-8">
          SaaS Dashboard
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300
              hover:text-white hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-200">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Overview
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
