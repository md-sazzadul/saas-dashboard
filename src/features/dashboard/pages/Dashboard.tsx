import { useState } from "react";
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

  const { data, isLoading, error } = useDashboard();
  const { data: users = [] } = useUsers();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  if (!data) return <EmptyState />;

  const filteredUsers =
    filter === "all" ? users : users.filter((u: any) => u.status === filter);

  return (
    <div>
      <Filters onFilterChange={setFilter} />

      <StatsCards stats={data.stats} />

      <ChartSection data={data.chart} />

      <UsersTable users={filteredUsers} />
    </div>
  );
};

export default Dashboard;
