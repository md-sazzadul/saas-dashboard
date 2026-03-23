import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/dashboardApi";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
