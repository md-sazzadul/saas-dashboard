import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChartSection from "../components/ChartSection";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import Skeleton from "../components/Skeleton";
import StatsCards from "../components/StatsCards";
import UsersTable from "../components/UsersTable";
import { useDashboard } from "../hooks/useDashboard";
import { usePagination } from "../hooks/usePagination";
import { useSort } from "../hooks/useSort";
import { useUsers } from "../hooks/useUsers";

const PAGE_SIZE = 5;

const Dashboard = () => {
  const [filter, setFilter] = useState("all");

  const { data, isLoading, isError: dashError } = useDashboard();
  const { data: users = [], isError: usersError } = useUsers();

  useEffect(() => {
    if (dashError) toast.error("Failed to load dashboard data.");
  }, [dashError]);

  useEffect(() => {
    if (usersError) toast.error("Failed to load users.");
  }, [usersError]);

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.status === filter);

  const { sortedItems, sortConfig, toggleSort } = useSort(filteredUsers);

  const pagination = usePagination(sortedItems, PAGE_SIZE);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    pagination.reset();
    const label = value === "all" ? "all users" : `${value} users`;
    toast.success(`Showing ${label}`, { duration: 2000 });
  };

  if (isLoading) return <Skeleton />;
  if (dashError) return <ErrorState />;
  if (!data) return <EmptyState />;

  return (
    <div>
      <Filters onFilterChange={handleFilterChange} />

      <StatsCards stats={data.stats} />

      <ChartSection data={data.chart} />

      <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <UsersTable
          users={pagination.paginatedItems}
          sortConfig={sortConfig}
          onSort={(key) => {
            toggleSort(key);
            pagination.reset();
          }}
        />
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.goToPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
