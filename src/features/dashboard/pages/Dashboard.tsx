import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiArrowPath } from "react-icons/hi2";
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

// ── Inline sub-components ───────────────────────────────────────────────────

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
    role="status"
    aria-live="polite"
    aria-label={`No search results for "${query}"${filter !== "all" ? ` in ${filter} users` : ""}`}
  >
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
      aria-hidden="true"
      style={{ background: "color-mix(in srgb, currentColor 6%, transparent)" }}
    >
      🔍
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        No results for{" "}
        <strong className="font-semibold text-gray-900 dark:text-white">
          "{query}"
        </strong>
        {filter !== "all" && (
          <span className="text-gray-400">
            {" "}
            in <strong className="font-semibold">{filter}</strong>
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
          type="button"
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
          type="button"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
        >
          Reset filter
        </button>
      )}
    </div>
  </div>
);

const UsersErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div
    className="flex flex-col items-center justify-center py-14 px-4 gap-3"
    role="alert"
    aria-live="assertive"
  >
    <div
      aria-hidden="true"
      className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center"
    >
      <span className="text-red-500 text-lg">!</span>
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-red-500 dark:text-red-400">
        Failed to load users
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
        There was a problem fetching the user list
      </p>
    </div>
    <button
      onClick={onRetry}
      type="button"
      className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
        text-indigo-600 dark:text-indigo-400 transition-all duration-150"
      style={{
        background: "color-mix(in srgb, var(--accent) 10%, transparent)",
      }}
    >
      <HiArrowPath aria-hidden="true" className="w-3.5 h-3.5" />
      Try again
    </button>
  </div>
);

const NoUsersState = () => (
  <div
    className="flex flex-col items-center justify-center py-14 px-4 gap-3"
    role="status"
  >
    <div
      aria-hidden="true"
      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
      style={{ background: "color-mix(in srgb, currentColor 6%, transparent)" }}
    >
      👥
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        No users yet
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
        Users will appear here once they sign up
      </p>
    </div>
  </div>
);

// ── Main page ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /*
    announceRef: an off-screen ARIA live region that announces dynamic
    changes (search result counts, filter changes) to screen reader users
    without visually disrupting the layout. We use aria-live="polite" so
    the announcement waits for the user to finish their current action.
  */
  const announceRef = useRef<HTMLParagraphElement>(null);
  const announce = useCallback((message: string) => {
    if (announceRef.current) {
      // Clear first so identical consecutive messages still fire
      announceRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announceRef.current) announceRef.current.textContent = message;
      });
    }
  }, []);

  const {
    data,
    isLoading,
    isError: dashError,
    refetch: refetchDash,
  } = useDashboard();

  const {
    data: users = [],
    isError: usersError,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useUsers();

  useEffect(() => {
    if (dashError) toast.error("Failed to load dashboard data.");
  }, [dashError]);

  useEffect(() => {
    if (usersError) toast.error("Failed to load users.");
  }, [usersError]);

  // ── Derived data pipeline ──
  const filteredUsers = useFilteredUsers(users, filter);
  const { query, setQuery, filteredBySearch } = useSearch(filteredUsers);
  const { sortedItems, sortConfig, toggleSort } = useSort(filteredBySearch);
  const pagination = usePagination(sortedItems, PAGE_SIZE);

  // Announce result count changes to screen readers
  useEffect(() => {
    if (!usersLoading && !usersError) {
      if (query.trim()) {
        announce(
          `${filteredBySearch.length} result${filteredBySearch.length !== 1 ? "s" : ""} for "${query}"`,
        );
      } else if (filter !== "all") {
        announce(
          `Showing ${filteredUsers.length} ${filter} user${filteredUsers.length !== 1 ? "s" : ""}`,
        );
      }
    }
  }, [
    query,
    filter,
    filteredBySearch.length,
    filteredUsers.length,
    usersLoading,
    usersError,
    announce,
  ]);

  // ── Handlers ──
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

  const handleRetryUsers = useCallback(() => {
    void refetchUsers();
  }, [refetchUsers]);

  const handleRetryDash = useCallback(() => {
    void refetchDash();
  }, [refetchDash]);

  // ── Render states ──
  if (isLoading) {
    return (
      /*
        aria-busy signals to AT that the region is loading.
        aria-label describes what is loading.
      */
      <div aria-busy="true" aria-label="Loading dashboard data">
        <Skeleton />
      </div>
    );
  }

  if (dashError)
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center justify-center py-24 gap-4"
      >
        <ErrorState />
        <button
          onClick={handleRetryDash}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
            text-indigo-600 dark:text-indigo-400 transition-all duration-150"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
        >
          <HiArrowPath aria-hidden="true" className="w-4 h-4" />
          Retry
        </button>
      </div>
    );

  if (!data) return <EmptyState />;

  const chartData = Array.isArray(data.chart) ? data.chart : [];
  const hasFilteredResults = filteredBySearch.length > 0;
  const showNoSearchResults =
    !hasFilteredResults && (query.trim() !== "" || filter !== "all");

  const renderUsersBody = () => {
    if (usersLoading) {
      return (
        <div
          className="flex items-center justify-center py-12"
          aria-busy="true"
          aria-label="Loading users"
        >
          <HiArrowPath
            aria-hidden="true"
            className="w-5 h-5 animate-spin text-gray-400 dark:text-gray-600"
          />
          {/* Visually hidden text for screen readers */}
          <span className="sr-only">Loading users, please wait…</span>
        </div>
      );
    }

    if (usersError) return <UsersErrorState onRetry={handleRetryUsers} />;
    if (users.length === 0) return <NoUsersState />;

    if (hasFilteredResults) {
      return (
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
      );
    }

    if (showNoSearchResults) {
      return (
        <NoSearchResults
          query={query}
          filter={filter}
          onClearSearch={() => handleSearchChange("")}
          onClearFilter={handleClearFilter}
        />
      );
    }

    return <NoFilterResults filter={filter} onClear={handleClearFilter} />;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/*
        Off-screen ARIA live region for dynamic announcements.
        Positioned off-screen via sr-only so it's invisible but
        picked up by screen readers whenever its content changes.
      */}
      <p
        ref={announceRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* ── Page header ─────────────────────────────────────────────────
          <h1> establishes the heading hierarchy for the page. There should
          be exactly ONE <h1> per page (WCAG 2.4.6). Sub-sections use <h2>.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="mb-6 animate-fade-up">
        <h1
          className="text-xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        {/* time element with datetime attribute for semantic date markup */}
        <p className="text-sm text-gray-400 dark:text-gray-600 mt-0.5">
          <time dateTime={new Date().toISOString().split("T")[0]}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────
          Wrapped in <section> with an accessible heading so AT users can
          navigate directly to this region via heading/landmark shortcuts.
      ─────────────────────────────────────────────────────────────────── */}
      <section aria-labelledby="stats-heading">
        {/* aria-labelledby associates the section with its <h2> */}
        <h2 id="stats-heading" className="sr-only">
          Key metrics
        </h2>
        <StatsCards stats={data.stats} chartData={chartData} />
      </section>

      {/* ── Chart ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="chart-heading">
        <h2 id="chart-heading" className="sr-only">
          Revenue overview chart
        </h2>
        <ChartSection data={chartData} />
      </section>

      {/* ── Users section ───────────────────────────────────────────────
          <section> + aria-labelledby ties the visible "Users" heading
          to the region, making it discoverable via screen reader landmarks.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="users-heading"
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
                id="users-heading"
                className="text-sm font-semibold text-gray-900 dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Users
              </h2>
              {/* aria-live="polite" so count updates are announced */}
              <p
                className="text-xs text-gray-400 dark:text-gray-600 mt-0.5"
                aria-live="polite"
                aria-atomic="true"
              >
                {usersError
                  ? "Unable to load"
                  : query
                    ? `${filteredBySearch.length} result${filteredBySearch.length !== 1 ? "s" : ""}`
                    : `${filteredUsers.length} ${filter !== "all" ? filter : "total"}`}
              </p>
            </div>
            {!usersError && users.length > 0 && (
              <Filters value={filter} onFilterChange={handleFilterChange} />
            )}
          </div>
          {!usersError && users.length > 0 && (
            <SearchBar value={query} onChange={handleSearchChange} />
          )}
        </div>

        {renderUsersBody()}
      </section>

      {/* User detail drawer */}
      <UserDrawer user={selectedUser} onClose={handleCloseDrawer} />
    </div>
  );
};

export default Dashboard;
