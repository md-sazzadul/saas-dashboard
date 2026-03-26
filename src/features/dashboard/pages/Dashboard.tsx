import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChartSection from "../components/ChartSection";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Filters from "../components/Filters";
import NoFilterResults from "../components/NoFilterResults";
import Pagination from "../components/Pagination";
import Skeleton from "../components/Skeleton";
import StatsCards from "../components/StatsCards";
import UsersTable from "../components/UsersTable";
import { useDashboard } from "../hooks/useDashboard";
import { useFilteredUsers } from "../hooks/useFilteredUsers";
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

  const filteredUsers = useFilteredUsers(users, filter);
  const { sortedItems, sortConfig, toggleSort } = useSort(filteredUsers);
  const pagination = usePagination(sortedItems, PAGE_SIZE);

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilter(value);
      pagination.reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleClearFilter = useCallback(() => {
    handleFilterChange("all");
  }, [handleFilterChange]);

  const handleSort = useCallback(
    (key: Parameters<typeof toggleSort>[0]) => {
      toggleSort(key);
      pagination.reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleSort],
  );

  if (isLoading) return <Skeleton />;
  if (dashError) return <ErrorState />;
  if (!data) return <EmptyState />;

  const hasFilteredResults = filteredUsers.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6 animate-fade-up">
        <h1
          className="text-xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-600 mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={data.stats} />

      {/* Chart */}
      <ChartSection data={data.chart} />

      {/* Users section */}
      <div
        className="mt-4 animate-fade-up rounded-xl border overflow-hidden"
        style={{
          borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          animationDelay: "240ms",
        }}
      >
        {/* Section header */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{
            background: "var(--surface-1)",
            borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
          }}
        >
          <div>
            <h2
              className="text-sm font-semibold text-gray-900 dark:text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Users
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              {filteredUsers.length} {filter !== "all" ? filter : "total"}
            </p>
          </div>
          <Filters value={filter} onFilterChange={handleFilterChange} />
        </div>

        {hasFilteredResults ? (
          <>
            <UsersTable
              users={pagination.paginatedItems}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.goToPage}
            />
          </>
        ) : (
          <NoFilterResults filter={filter} onClear={handleClearFilter} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
