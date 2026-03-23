import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../api/dashboardApi";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });
};
