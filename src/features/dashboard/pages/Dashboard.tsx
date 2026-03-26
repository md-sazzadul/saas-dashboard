import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChartSection from "../components/ChartSection";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Filters from "../components/Filters";
import NoFilterResults from "../components/NoFilterResults";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Skeleton from "../components/Skeleton";
import StatsCards from "../components/StatsCards";
import UserDrawer from "../components/UserDrawer";
import UsersTable from "../components/UsersTable";
import { useDashboard } from "../hooks/useDashboard";
import { useFilteredUsers } from "../hooks/useFilteredUsers";
import { usePagination } from "../hooks/usePagination";
import { useSearch } from "../hooks/useSearch";
import { useSort } from "../hooks/useSort";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../types";

const PAGE_SIZE = 5;

const Dashboard = () => {
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, isError: dashError } = useDashboard();
  const { data: users = [], isError: usersError } = useUsers();

  useEffect(() => {
    if (dashError) toast.error("Failed to load dashboard data.");
  }, [dashError]);

  useEffect(() => {
    if (usersError) toast.error("Failed to load users.");
  }, [usersError]);

  const filteredUsers = useFilteredUsers(users, filter);
  const { query, setQuery, filteredBySearch } = useSearch(filteredUsers);
  const { sortedItems, sortConfig, toggleSort } = useSort(filteredBySearch);
  const pagination = usePagination(sortedItems, PAGE_SIZE);

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilter(value);
      pagination.reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      pagination.reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setQuery],
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

  const handleRowClick = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedUser(null);
  }, []);

  if (isLoading) return <Skeleton />;
  if (dashError) return <ErrorState />;
  if (!data) return <EmptyState />;

  const hasFilteredResults = filteredBySearch.length > 0;
  const showNoResults = !hasFilteredResults && (query || filter !== "all");

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
      <StatsCards stats={data.stats} chartData={data.chart} />

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
          className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
          style={{
            background: "var(--surface-1)",
            borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
          }}
        >
          <div className="flex items-center gap-4">
            <div>
              <h2
                className="text-sm font-semibold text-gray-900 dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Users
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                {query
                  ? `${filteredBySearch.length} result${filteredBySearch.length !== 1 ? "s" : ""}`
                  : `${filteredUsers.length} ${filter !== "all" ? filter : "total"}`}
              </p>
            </div>
            <Filters value={filter} onFilterChange={handleFilterChange} />
          </div>
          <SearchBar value={query} onChange={handleSearchChange} />
        </div>

        {hasFilteredResults ? (
          <>
            <UsersTable
              users={pagination.paginatedItems}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={handleRowClick}
              searchQuery={query}
            />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.goToPage}
            />
          </>
        ) : showNoResults ? (
          <NoSearchResults
            query={query}
            filter={filter}
            onClearSearch={() => handleSearchChange("")}
            onClearFilter={handleClearFilter}
          />
        ) : (
          <NoFilterResults filter={filter} onClear={handleClearFilter} />
        )}
      </div>

      {/* User detail drawer */}
      <UserDrawer user={selectedUser} onClose={handleCloseDrawer} />
    </div>
  );
};

// Inline component for no search results
const NoSearchResults = ({
  query,
  filter,
  onClearSearch,
  onClearFilter,
}: {
  query: string;
  filter: string;
  onClearSearch: () => void;
  onClearFilter: () => void;
}) => (
  <div
    className="flex flex-col items-center justify-center py-14 px-4 gap-3"
    style={{ background: "var(--surface-1)" }}
  >
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
      style={{ background: "color-mix(in srgb, currentColor 6%, transparent)" }}
    >
      🔍
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        No results for{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          "{query}"
        </span>
        {filter !== "all" && (
          <span className="text-gray-400">
            {" "}
            in <span className="font-semibold">{filter}</span>
          </span>
        )}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
        Try a different name or ID
      </p>
    </div>
    <div className="flex items-center gap-2 mt-1">
      {query && (
        <button
          onClick={onClearSearch}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-all duration-150"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
        >
          Clear search
        </button>
      )}
      {filter !== "all" && (
        <button
          onClick={onClearFilter}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
        >
          Reset filter
        </button>
      )}
    </div>
  </div>
);

export default Dashboard;
