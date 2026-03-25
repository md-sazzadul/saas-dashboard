import toast from "react-hot-toast";
import { HiArrowRightOnRectangle, HiHome } from "react-icons/hi2";
import { Outlet } from "react-router";
import { logout } from "../../utils/auth";
import ThemeToggle from "../ui/ThemeToggle";

const DashboardLayout = () => {
  const handleLogout = () => {
    toast.success("Signed out successfully.");
    // Brief pause so the toast is visible before the redirect
    setTimeout(logout, 800);
  };

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
            <HiHome className="w-4 h-4" />
            Dashboard
          </a>
        </nav>

        {/* Logout at bottom of sidebar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400
            hover:text-white hover:bg-gray-800 transition-colors text-sm w-full mt-auto"
        >
          <HiArrowRightOnRectangle className="w-4 h-4" />
          Sign out
        </button>
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
