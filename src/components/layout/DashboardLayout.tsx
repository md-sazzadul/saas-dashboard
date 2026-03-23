import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white p-6">Sidebar</aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6">
          Navbar
        </header>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
