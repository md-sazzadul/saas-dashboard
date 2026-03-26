import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/dashboardApi";
import type { User } from "../types";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
