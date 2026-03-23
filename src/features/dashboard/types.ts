export type Stats = {
  revenue: number;
  users: number;
  conversion: number;
};

export type ChartData = {
  name: string;
  revenue: number;
};

export type DashboardData = {
  stats: Stats;
  chart: ChartData[];
};

export type User = {
  id: number;
  name: string;
  status: "active" | "inactive";
  revenue: number;
};
