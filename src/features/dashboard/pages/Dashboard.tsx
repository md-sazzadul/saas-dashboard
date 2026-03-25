import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChartSection from "../components/ChartSection";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Filters from "../components/Filters";
import Skeleton from "../components/Skeleton";
import StatsCards from "../components/StatsCards";
import UsersTable from "../components/UsersTable";
import { useDashboard } from "../hooks/useDashboard";
import { useUsers } from "../hooks/useUsers";

const Dashboard = () => {
  const [filter, setFilter] = useState("all");

  const { data, isLoading, isError: dashError } = useDashboard();
  const { data: users = [], isError: usersError } = useUsers();

  // Show toast when data fetches fail
  useEffect(() => {
    if (dashError) toast.error("Failed to load dashboard data.");
  }, [dashError]);

  useEffect(() => {
    if (usersError) toast.error("Failed to load users.");
  }, [usersError]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    const label = value === "all" ? "all users" : `${value} users`;
    toast.success(`Showing ${label}`, { duration: 2000 });
  };

  if (isLoading) return <Skeleton />;
  if (dashError) return <ErrorState />;
  if (!data) return <EmptyState />;

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u: { status: string }) => u.status === filter);

  return (
    <div>
      <Filters onFilterChange={handleFilterChange} />

      <StatsCards stats={data.stats} />

      <ChartSection data={data.chart} />

      <UsersTable users={filteredUsers} />
    </div>
  );
};

export default Dashboard;
